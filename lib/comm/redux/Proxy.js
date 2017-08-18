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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Proxy is only rendered in html DOM so window exists for sure

var Proxy = function (_Component) {
    (0, _inherits3.default)(Proxy, _Component);

    function Proxy() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, Proxy);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Proxy.__proto__ || (0, _getPrototypeOf2.default)(Proxy)).call.apply(_ref, [this].concat(args))), _this), _this.mounted = false, _this.initialState = {}, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }
    // static propTypes = {
    //     Component: React.Component,
    //     id: PropTypes.string,
    //     setSetState: PropTypes.func.isRequired,
    //     dispatch: PropTypes.func.isRequired
    // }


    (0, _createClass3.default)(Proxy, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.mounted = true;
            var setSetState = this.props.setSetState;

            setSetState(this.setState.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                Component = _props.Component,
                dispatch = _props.dispatch;

            var state = this.state;
            if (!this.mounted) {
                // because on mount, state has not yet been received, so dont render
                return null;
            } else {
                return _react2.default.createElement(Component, (0, _extends3.default)({}, state, { dispatch: dispatch }));
            }
        }
    }]);
    return Proxy;
}(_react.Component);

exports.default = Proxy;