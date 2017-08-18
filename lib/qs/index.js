'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.toRFC3986 = toRFC3986;

var _utils = require('qs/lib/utils');

var _formats = require('qs/lib/formats');

function toRFC3986(str) {
	return _formats.formatters['RFC3986']((0, _utils.encode)(str));
}