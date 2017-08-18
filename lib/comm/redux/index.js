'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderProxiedElement = exports.Server = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactDom = require('react-dom');

var _recompose = require('cmn/recompose');

var _all = require('cmn/all');

var _elements = require('./elements');

var _elements2 = _interopRequireDefault(_elements);

var _Proxy = require('./Proxy');

var _Proxy2 = _interopRequireDefault(_Proxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-unused-vars
// TODO: figure out how to make redux-offline only persist some keys, like there is no reason to persist messages
function renderProxiedElement(callInReduxScope, server_name, component, container, wanted) {
    // this should imported and executed in the dom where we want to render the html element
    // if ReduxServer is in same scope, set callInReduxPath to gReduxServer
    // resolves with elementid - so dever can use with dispatch(removeElement(id)) --- actually i changed it, it resolves with a helper function which internally does dispatch(removeElement(id)), see link7884721
    // component - react class
    // container - dom target - document.getElementById('root')
    // wanted - wanted state
    // store.dispatch(addElement('todo', component.name, wanted));    if (Array.isArray(callInReduxPath)) {

    var callInRedux = function callInRedux(method) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return callInReduxScope.apply(undefined, [server_name + '.' + method].concat(args));
    };

    var resolveAfterMount = void 0; // resolves with unmount function
    var promise = new _promise2.default(function (resolve) {
        resolveAfterMount = function resolveAfterMount(val) {
            return resolve(val);
        };
    });

    var id = void 0; // element id
    var setState = void 0;

    var dispatch = function dispatch(action) {
        // TODO: NOTE: if there are keys which have data that can be transferred, it should be be in __XFER key in the object returned by the action declared in the files in ./flows/* ---- i might have to do a test in Comm sendMessage to test if the data in key marked for possible transferrable, is actually transferrable MAYBE im not sure, the browser might handle it, but if data is duplicated i should do the check
        callInRedux('dispatch', action);
    };

    // const unmountProxiedElement = function(dontUnmount, dontDispatch) {
    //     console.log('DOING unmountProxiedElement');
    //     if (!dontDispatch) dispatch(removeElement(id, dontUnmount));
    // };

    var progressor = function progressor(aArg) {
        var __PROGRESS = aArg.__PROGRESS;


        if (__PROGRESS) {
            var state = aArg.state;

            if (id === undefined) {
                id = aArg.id;
                var setSetState = function setSetState(aSetState) {
                    setState = aSetState;
                    setState(function () {
                        return state;
                    });
                };
                (0, _reactDom.render)(_react2.default.createElement(_Proxy2.default, { Component: component, id: id, setSetState: setSetState, dispatch: dispatch }), container);
                resolveAfterMount(function (dontUnmount) {
                    return dispatch((0, _elements.removeElement)(id, dontUnmount));
                }); // link7884721
            } else {
                setState(function () {
                    return state;
                });
            }
        } else {
            // unmounted - server was shutdown by unregister()
            console.log('ok unmounting in dom, aArg:', aArg);
            if (!aArg || !aArg.dontUnmount) (0, _reactDom.unmountComponentAtNode)(container);
        }
    };

    callInRedux('addElement', { wanted: wanted }, progressor);

    // window is defintiely available, as renderProxiedElement is only used in DOM
    window.addEventListener('unload', function () {
        return dispatch((0, _elements.removeElement)(id, true));
    }, false);

    return promise;
}
// import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
// import { offline } from 'redux-offline'
// import offlineConfigDefault from 'redux-offline/lib/defaults'
// import thunk from 'redux-thunk'


var Server = function () {
    // holds promises, to trigger to remove element

    // store = undefined
    // serverElement
    function Server(reducers, serverElement) {
        var _this = this;

        (0, _classCallCheck3.default)(this, Server);
        this.nextelementid = 0;
        this.removeElement = {};

        this.render = function () {
            console.log('IN SERVER RENDER');
            var state = _this.store.getState();
            var elements = state.elements;

            // check if any element was removed, if so then trigger this.removeElement which will resolve its hanging promise

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(_this.removeElement)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var id = _step.value;

                    if (!(id in elements)) {
                        _this.removeElement(id);
                    }
                }

                // TODO: shallowEqual here to figure out if i should update anything
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(elements), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _ref2 = _step2.value;
                    var wanted = _ref2.wanted,
                        setState = _ref2.setState;

                    setState(buildWantedState(wanted, state));
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            _this.serverElement(state, _this.store.dispatch); // equilavent of serverElement.setState(state)
        };

        this.addElement = function (aArg, aReportProgress /*, ...args*/) {
            // console.log('in addElement, aArg:', aArg, 'aReportProgress:', aReportProgress, 'args:', args);
            console.log('in addElement, aArg:', aArg);
            var id = (_this.nextelementid++).toString(); // toString because it is used as a key in react - crossfile-link3138470
            return new _promise2.default(function (resolve) {
                // i need to return promise, because if it is Comm, a promise will keep it alive so it keeps responding to aReportProgress
                var wanted = aArg.wanted;

                var setState = function setState(state) {
                    return aReportProgress({ id: id, state: state });
                };
                _this.store.dispatch((0, _elements.addElement)(id, wanted, setState));

                // this.removeElement[id] is only to be called by render as a result of dispatch(removeElement)
                _this.removeElement[id] = function () {
                    delete _this.removeElement[id];
                    resolve({ destroyed: true });
                };
            });
        };

        // this.store = createStore(reducer, undefined, compose(applyMiddleware(thunk), offline(offlineConfigDefault)));
        // this.store = createStore(combineReducers(reducers), undefined, compose(applyMiddleware(thunk), offline(offlineConfigDefault)));
        // this.store = createStore(combineReducers(reducers), undefined, applyMiddleware(thunk));
        this.store = (0, _redux.createStore)((0, _redux.combineReducers)((0, _extends3.default)({}, reducers, { elements: _elements2.default })));

        this.store.subscribe(this.render);
        this.serverElement = serverElement;
        this.render();
    }

    (0, _createClass3.default)(Server, [{
        key: 'dispatch',
        value: function dispatch(aArg) {
            var action = aArg;
            this.store.dispatch(action);
        }
    }]);
    return Server;
}();

var DOTPATH_AS_PATT = /(.+) as (.+)$/m;
function buildWantedState(wanted, state) {
    console.log('state:', state, 'wanted:', wanted);
    var wanted_state = {};
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = (0, _getIterator3.default)(wanted), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var dotpath = _step3.value;

            var name = void 0;
            if (DOTPATH_AS_PATT.test(dotpath)) {
                // ([, dotpath, name] = DOTPATH_AS_PATT.exec(dotpath));
                var matches = DOTPATH_AS_PATT.exec(dotpath);
                dotpath = matches[1];
                name = matches[2];
            } else {
                name = dotpath.split('.');
                name = name[name.length - 1];
            }
            wanted_state[name] = (0, _all.deepAccessUsingString)(state, dotpath, 'THROW');
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return wanted_state;
}

exports.Server = Server;
exports.renderProxiedElement = renderProxiedElement;