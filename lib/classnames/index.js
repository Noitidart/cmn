'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.classnames = classnames;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function classnames() {
    // returns undefined instead of blank string for use with react per - https://github.com/JedWatson/classnames/issues/115#issuecomment-284296632
    return _classnames2.default.apply(undefined, arguments) || undefined;
}