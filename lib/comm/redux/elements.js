'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.addElement = addElement;
exports.removeElement = removeElement;
exports.default = elements;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ACTIONS and REDUCER
var ADD_ELEMENT = 'ADD_ELEMENT';
function addElement(id, wanted, setState) {
    // NOTE: id must be a string because i use it as a react key crossfile-link3138470
    // wanted array of dotpaths, to deepAccessUsingString on redux store/state
    return {
        type: ADD_ELEMENT,
        id: id,
        wanted: wanted,
        setState: setState
    };
}

var REMOVE_ELEMENT = 'REMOVE_ELEMENT';
function removeElement(id, dontUnmount) {
    return {
        type: REMOVE_ELEMENT,
        id: id,
        dontUnmount: dontUnmount
    };
}

function elements() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var action = arguments[1];

    var type = void 0;
    var _action = action;
    type = _action.type;
    action = (0, _objectWithoutProperties3.default)(_action, ['type']);

    switch (type) {
        case ADD_ELEMENT:
            {
                var element = action;
                return [].concat((0, _toConsumableArray3.default)(state), [element]);
            }
        case REMOVE_ELEMENT:
            {
                var _action2 = action,
                    id = _action2.id;

                return state.filter(function (element) {
                    return element.id !== id;
                });
            }
        default:
            return state;
    }
}