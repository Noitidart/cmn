'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.shallowEqual = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

exports.shallowEqualDepth = shallowEqualDepth;
exports.depth0Or1Equal = depth0Or1Equal;

var _shallowEqual = require('recompose/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _all = require('../all');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////
function shallowEqualDepth(arrobj1, arrobj2) {
    var maxDepth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    // maxDepth is 0 based, so maxDepth of 2 checks 3 levels
    var els1 = [arrobj1];
    var els2 = [arrobj2];

    var nextEls1 = [];
    var nextEls2 = [];

    var depth = 0;
    while (els1.length) {
        if (els1.length !== els2.length) return false;

        var el1 = els1.shift();
        var el2 = els2.shift();

        // console.log('will now compare el1:', el1, 'el2:', el2);

        if (depth === maxDepth) {
            if (!(0, _shallowEqual2.default)(el1, el2)) {
                // console.log('depth has reached max depth, and shallowEqual is false', 'el1:', el1, 'el2:', el2);
                return false;
            }
        } else {
            if (Array.isArray(el1) && Array.isArray(el2)) {
                if (!shallowify(el1, el2, nextEls1, nextEls2)) {
                    // console.log('shallowify arr reutnred false');
                    return false;
                }
            } else if ((0, _all.isObject)(el1) && (0, _all.isObject)(el2)) {
                var kels1 = flattenDepth1((0, _entries2.default)(el1).sort(sortEntriesByKey));
                var kels2 = flattenDepth1((0, _entries2.default)(el2).sort(sortEntriesByKey));
                // console.log('kels1:', kels1, 'kels2:', kels2);
                if (!shallowify(kels1, kels2, nextEls1, nextEls2)) {
                    // console.log('shallowify obj reutnred false');
                    return false;
                }
            } else {
                if (!(0, _shallowEqual2.default)(el1, el2)) {
                    // console.log('el1 !== el2', el1, el2);
                    return false;
                }
            }
        }

        if (!els1.length || !els2.length) {
            if (depth === maxDepth) {
                // console.log('return true as max depth done');
                return true;
            } else {
                depth++;
                // console.log('increasing depth, pushing in', 'nextEls1:', nextEls1, 'nextEls2:', nextEls2);
                els1.push.apply(els1, nextEls1);
                els2.push.apply(els2, nextEls2);
                nextEls1.length = 0;
                nextEls2.length = 0;
            }
        }
    }

    // console.log('out of while so return');
    return true;
}

function shallowify(arr1, arr2, next1, next2) {
    // shallow compares non-array, non-obj elements, and pushes the array/obj elements ot the next depth
    if (arr1.length !== arr2.length) return false;
    var l = arr1.length;
    for (var i = 0; i < l; i++) {
        var subel1 = arr1[i];
        var subel2 = arr2[i];
        if (Array.isArray(subel1) && Array.isArray(subel2)) {
            next1.push(subel1);
            next2.push(subel2);
        } else if ((0, _all.isObject)(subel1) && (0, _all.isObject)(subel2)) {
            next1.push(subel1);
            next2.push(subel2);
        } else {
            // console.log('comparing', 'subel1:', subel1, 'subel2:', subel2);
            if (!(0, _shallowEqual2.default)(subel1, subel2)) return false;
            // console.log('ok same');
        }
    }
    return true;
}

function sortEntriesByKey(_ref, _ref2) {
    var _ref4 = (0, _slicedToArray3.default)(_ref, 1),
        a = _ref4[0];

    var _ref3 = (0, _slicedToArray3.default)(_ref2, 1),
        b = _ref3[0];

    return a.localeCompare(b);
}

// https://gist.github.com/Integralist/749153aa53fea7168e7e#gistcomment-1997822
function flattenDepth1(arr) {
    var _Array$prototype;

    // flattens 1 level deep, like a Object.entries
    return (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, (0, _toConsumableArray3.default)(arr));
}

///////
// depth0Or1Equal({a:[]}, {a:[]}) === false
// depth0Or1Equal({a:[]}, {a:[]}, {a:1}) === true
function depth0Or1Equal(obj1, obj2) {
    var depth1Keys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    // depth1Keys is objecect of keys you want to test at depth of 1, by default test depth of 0
    var keys1 = (0, _keys2.default)(obj1);
    var keys2 = (0, _keys2.default)(obj2);
    if (keys1.length !== keys2.length) return false;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(keys1), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            if (!(key in obj2)) return false;

            var val1 = obj1[key];
            var val2 = obj2[key];
            if (key in depth1Keys) {
                if (!(0, _shallowEqual2.default)(val1, val2)) return false;
            } else {
                if (val1 !== val2) return false;
            }
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

    return true;
}

exports.shallowEqual = _shallowEqual2.default;