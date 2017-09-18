'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _wrapDisplayName = require('recompose/wrapDisplayName');

var _wrapDisplayName2 = _interopRequireDefault(_wrapDisplayName);

var _elements = require('./elements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// if wanted is undefiend - then it doesnt proxy, it just gives it prop of `dispatchProxied`
function proxyHOCFactory(callInReduxScope, serverName, wanted) {

    var callInRedux = function callInRedux(method) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return callInReduxScope.apply(undefined, [serverName + '.' + method].concat(args));
    };
    var dispatchProxied = function dispatchProxied(action) {
        return callInRedux('dispatch', action);
    }; // TODO: NOTE: if there are keys which have data that can be transferred, it should be be in __XFER key in the object returned by the action declared in the files in ./flow-control/* ---- i might have to do a test in Comm sendMessage to test if the data in key marked for possible transferrable, is actually transferrable MAYBE im not sure, the browser might handle it, but if data is duplicated i should do the check

    return function proxyHOC(WrappedComponent) {
        var _class, _temp;

        return _temp = _class = function (_Component) {
            (0, _inherits3.default)(ProxyConnect, _Component);

            function ProxyConnect() {
                (0, _classCallCheck3.default)(this, ProxyConnect);

                var _this = (0, _possibleConstructorReturn3.default)(this, (ProxyConnect.__proto__ || (0, _getPrototypeOf2.default)(ProxyConnect)).call(this));

                _this.state = {
                    id: undefined,
                    wantedState: !wanted ? undefined : wanted.reduce(function (acc, el) {
                        acc[el] = undefined;return acc;
                    }, {})
                };

                _this.proxy = function () {
                    callInRedux('addElement', { wanted: wanted }, _this.progressor);
                    window.addEventListener('unload', _this.unproxy);
                };

                _this.unproxy = function () {
                    var id = _this.state.id;

                    window.removeEventListener('unload', _this.unproxy);
                    dispatchProxied((0, _elements.removeElement)(id, true));
                };

                _this.progressor = function (aArg) {
                    var __PROGRESS = aArg.__PROGRESS;


                    if (__PROGRESS) {
                        var id = aArg.id,
                            wantedState = aArg.wantedState;
                        // console.log('progressor, got wantedState:', wantedState);

                        _this.setState(function (_ref) {
                            var idOld = _ref.id;
                            return idOld === undefined ? (0, _extends3.default)({ id: id }, wantedState) : wantedState;
                        }); // i dont have setState with id everytime, id is only needed for initial setState
                    } else {
                        console.log('ok unproxied in dom, aArg:', aArg);
                    } // unproxied - server was shutdown by unregister()
                };

                if (wanted) _this.proxy();
                return _this;
            }

            (0, _createClass3.default)(ProxyConnect, [{
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    if (wanted) this.unproxy();
                }
            }, {
                key: 'render',
                value: function render() {
                    var _state = this.state,
                        id = _state.id,
                        wantedState = _state.wantedState;

                    // test if id is undefined because on mount, state has not yet been received, so dont render

                    if (wanted) {
                        return id === undefined ? null : _react2.default.createElement(WrappedComponent, (0, _extends3.default)({}, this.props, { dispatchProxied: dispatchProxied }, wantedState));
                    } else {
                        // just give it dispatchProxied
                        return _react2.default.createElement(WrappedComponent, (0, _extends3.default)({}, this.props, { dispatchProxied: dispatchProxied }));
                    }
                }
            }]);
            return ProxyConnect;
        }(_react.Component), _class.displayName = (0, _wrapDisplayName2.default)(WrappedComponent, 'ProxyConnect'), _temp;
    };
}

exports.default = proxyHOCFactory;