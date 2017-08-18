'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isImmutable = isImmutable;

var _immutable = require('immutable');

function isImmutable(target) {
    if (!target) return false; // if undefined or null (if 0 or blank string as well)
    else return _immutable.Iterable.isIterable(target);
}