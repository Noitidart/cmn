'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _all = require('../../all');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DOTPATH_AS_PATT = /(.+) as (.+)$/m;
function buildWantedState(wanted, state) {
    console.log('state:', state, 'wanted:', wanted);
    var wanted_state = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(wanted), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var dotpath = _step.value;

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

    return wanted_state;
}

var ElementServer = (0, _reactRedux.connect)(function (state, ownProps) {
    var wanted = ownProps.wanted;

    return {
        state: buildWantedState(wanted, state)
    };
})((_temp = _class = function (_Component) {
    (0, _inherits3.default)(ElementServerClass, _Component);

    function ElementServerClass() {
        (0, _classCallCheck3.default)(this, ElementServerClass);
        return (0, _possibleConstructorReturn3.default)(this, (ElementServerClass.__proto__ || (0, _getPrototypeOf2.default)(ElementServerClass)).apply(this, arguments));
    }

    (0, _createClass3.default)(ElementServerClass, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var _props = this.props,
                state = _props.state,
                setState = _props.setState;

            console.log('ElemenServer: ok something changed so doing setState');
            setState(state);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.componentDidUpdate();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement('div', null);
        }
    }]);
    return ElementServerClass;
}(_react.Component), _class.propTypes = {
    id: _react.PropTypes.string.isRequired,
    wanted: _react.PropTypes.arrayOf(_react.PropTypes.string).isRequired,
    setState: _react.PropTypes.func.isRequired,
    state: _react.PropTypes.any.isRequired // supplied by the redux.connect
}, _temp));

exports.default = ElementServer;