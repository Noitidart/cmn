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
exports.default = reducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// but really not any, its anything that is serializable
var INITIAL = [];

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

function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL;
    var action = arguments[1];
    var type = action.type,
        rest = (0, _objectWithoutProperties3.default)(action, ['type']);

    switch (type) {
        case ADD_ELEMENT:
            {
                var element = rest;
                var _id = element.id;

                var hasElement = state.find(function (element) {
                    return element.id === _id;
                });
                return hasElement ? state : [].concat((0, _toConsumableArray3.default)(state), [element]);
            }
        case REMOVE_ELEMENT:
            {
                var _id2 = rest.id;

                var stateNew = state.filter(function (element) {
                    return element.id !== _id2;
                });
                var didRemove = stateNew.length !== state.length;
                return didRemove ? stateNew : state;
            }
        default:
            return state;
    }
}