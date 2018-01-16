'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _redux = require('redux');

var _all = require('../../all');

var _elements = require('./elements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Server = function () {
    // holds promises, to trigger to remove element

    // store = undefined
    // serverElement
    // stateOld = undefined
    function Server(store, serverElement) {
        var _this = this;

        (0, _classCallCheck3.default)(this, Server);
        this.nextelementid = 0;
        this.removeElement = {};

        this.render = function () {
            // console.log('IN SERVER RENDER');
            var state = _this.store.getState();
            var _stateOld = _this.stateOld,
                stateOld = _stateOld === undefined ? {} : _stateOld;

            _this.stateOld = state;

            var elements = state.elements;
            var elementsOld = stateOld.elements;


            var changed = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(state)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    // console.log(`comparing if "${key}" changed in state, now:`, state[key], 'old:', stateOld[key]);
                    // if (!shallowEqualDepth(state[key], stateOld[key])) changed[key] = true;
                    if (!depth0Or1Equal(state[key], stateOld[key])) changed[key] = true; // as in server side, i can do reference checking, as i am careful in the reducers to return the same state if no change is needed
                    // console.log(key in changed ? 'yes it changed!' : 'no it didnt change', 'state:', state[key], 'stateOld:', stateOld[key]);
                }
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

            if (didWantedChange(['elements'], changed)) {
                var elementIds = (0, _all.arrayToObject)(elements, 'id');
                // console.log('removeElement:', this.removeElement, 'ids:', elementIds);
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(_this.removeElement)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var id = _step2.value;

                        if (!elementIds[id]) {
                            // this id was removed, so lets trigger the this.removeElement[id] of it
                            // console.log('id:', id, 'this id was removed, so lets trigger the this.removeElement[id] of it');
                            // TODO: because removeElement is not set until promise returns, AND if remove is called before that promise returns (which i dont think would ever happen BUT still it might depending on if a proxiedMount proxiedUnmount was called, i dont know if its setup for this right now but its possible due to async tick nature).... its a promise, i should do a retry until removeElement comes into existance. the promsie is seen at link8917472
                            _this.removeElement[id]();
                        }
                    }
                    // console.log('done iter');
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
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                var _loop = function _loop() {
                    var _ref = _step3.value;
                    var id = _ref.id,
                        wanted = _ref.wanted,
                        setState = _ref.setState;


                    var justAdded = !elementsOld.find(function (element) {
                        return element.id === id;
                    });
                    if (justAdded) {
                        // do setState, this is needed for triggering the mount
                        var _wantedState2 = buildWantedState(wanted, state) || {}; // the || {} is only for when justAdded/serverElement just mounting
                        setState(_wantedState2);
                    } else if (didWantedChange(wanted, changed)) {
                        var _wantedState3 = buildWantedState(wanted, state);
                        if (_wantedState3) setState(_wantedState3);
                    }
                };

                for (var _iterator3 = (0, _getIterator3.default)(elements), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    _loop();
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

            {
                var wanted = _this.serverElement.wantedState;
                // console.log('serverElement.wanted:', wanted);
                if (_this.serverElementDidNotMount) {
                    delete _this.serverElementDidNotMount;
                    var wantedState = buildWantedState(wanted, state) || {}; // the || {} is only for when justAdded/serverElement just mounting
                    _this.serverElement(wantedState, stateOld, _this.store.dispatch); // equilavent of serverElement.setState(state)
                } else if (didWantedChange(wanted, changed)) {
                    // console.log('will get wantedState and render background element maybe');
                    var _wantedState = buildWantedState(wanted, state);
                    if (_wantedState) _this.serverElement(_wantedState, stateOld, _this.store.dispatch); // equilavent of serverElement.setState(state)
                }
                // else { console.log('will not render background element as no change'); }
            }
        };

        this.addElement = function (aArg, aReportProgress /*, ...args*/) {
            // console.log('in addElement, aArg:', aArg, 'aReportProgress:', aReportProgress, 'args:', args);
            // console.log('in addElement, aArg:', aArg);
            var id = (_this.nextelementid++).toString(); // toString because it is used as a key in react - crossfile-link3138470
            return new _promise2.default(function (resolve) {
                // i need to return promise, because if it is Comm, a promise will keep it alive so it keeps responding to aReportProgress
                var wanted = aArg.wanted;

                var setState = function setState(wantedState) {
                    return aReportProgress({ id: id, wantedState: wantedState });
                }; // wantedState is object of keys of `wanted` with their values from app state container TODO: probably dont send id everytime, probably just on first one - extremely slight perf enhance
                _this.store.dispatch((0, _elements.addElement)(id, wanted, setState));

                // this.removeElement[id] is only to be called by render as a result of dispatch(removeElement)
                _this.removeElement[id] = function () {
                    // link8917472 - see this thing is inside of a promise
                    delete _this.removeElement[id];
                    resolve({ destroyed: true });
                };
            });
        };

        // server side wantedState
        store.subscribe(this.render);
        this.store = store;
        this.serverElement = serverElement;
        this.serverElementDidNotMount = true;
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
}(); // TODO: is this todo on the right comment still valid? 082117 // TODO: figure out how to make redux-offline only persist some keys, like there is no reason to persist messages


function didWantedChange(wanted, changeds) {
    if (!wanted) return false;
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = (0, _getIterator3.default)(wanted), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var key = _step4.value;

            if (key in changeds) {
                return true;
            }
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    return false;
}

function buildWantedState(wanted, state) {
    // goes through keys of wanted, makes sure it is a key in state, if it is then it picks it
    // console.log('wanted:', wanted);
    // console.log('state:', state, 'wanted:', wanted);
    var wantedState = {};
    if (!wanted) return null;
    var somethingWanted = false;
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = (0, _getIterator3.default)(wanted), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var key = _step5.value;

            if (key in state) {
                somethingWanted = true;
                wantedState[key] = state[key];
            }
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }

    if (!somethingWanted) return null;
    return wantedState;
}

exports.default = Server;