'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = mergeJsonDeepWithRefs;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function specialTypeOf(v) {
    var type = typeof v === 'undefined' ? 'undefined' : (0, _typeof3.default)(v);
    if (['number', 'string', 'undefined', 'boolean'].includes(type)) {
        return type;
    } else {
        if (!v) return 'null';else if (Array.isArray(v)) return 'array';else return 'object';
    }
}

/* options has keys
{
    [key]: {
        // if array
        sortBy: function
    }
}

*/

var nonRefTypes = ['number', 'string', 'undefined', 'boolean', 'null'];
function mergeJsonDeepWithRefs(target, source) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var parentKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'root';

    // keeps refs of things that were unchanged, but if some child changed, then ref change bubbles to top
    // deep merge
    // target/source must be array or object
    // target/source must of same type
    // if objects: source can have missing keys. meaning keys in source do not have to be in target
    // compares ref, including of root, if same it assumes its same.
    // if refs different, it goes through and checks each value, if different then parent is marked as different

    // every time an object is found with changes, that object is assigned new

    if (target === source) return target; // no changes

    var targetType = specialTypeOf(target);
    var sourceType = specialTypeOf(source);
    if (targetType !== sourceType) throw new Error('types of target and source dont match');
    if (!['array', 'object'].includes(targetType)) throw new Error('types of target and source must be array or object');

    var hasChanges = false;

    var build = void 0;

    if (targetType === 'array') {

        // if array of objects, compare id'd object
        if (target.length && specialTypeOf(target[0]) === 'object' || source.length && specialTypeOf(source[0]) === 'object') {
            // treatment 1: order of target is retained, and source is just used to merge into, and remaining are concated. any new entries found in source, will be pushed onto the end, maintaining order in source

            build = [];
            var treatedSourceIds = {};

            var _loop = function _loop(i) {
                var targetValue = target[i];
                var sourceValue = source.find(function (entry) {
                    return entry.id === targetValue.id;
                });

                if (sourceValue) {
                    treatedSourceIds[targetValue.id] = undefined; // value doesnt matter
                    var mergedValue = mergeJsonDeepWithRefs(targetValue, sourceValue, options, parentKey + '[]');
                    build.push(mergedValue);
                    if (mergedValue !== targetValue) hasChanges = true;
                } else {
                    build.push(targetValue);
                }
            };

            for (var i = 0; i < target.length; i++) {
                _loop(i);
            }

            // concat in remaining from source, that were not treated. in order found in source
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(source), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _sourceValue = _step.value;

                    if (!treatedSourceIds.hasOwnProperty(_sourceValue.id)) {
                        // this sourceValue does not exist in target
                        build.push(_sourceValue);
                        hasChanges = true;
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
        } else {
            // treatment 2: order matters - array of non-objects

            // figure out if its changed
            if (target.length !== source.length) {
                hasChanges = true;
            } else {
                // check if each value same
                for (var i = 0; i < target.length; i++) {
                    var _targetValue = target[i];
                    var _sourceValue2 = source[i];
                    if (_targetValue !== _sourceValue2) {
                        hasChanges = true;
                        break;
                    }
                }
            }

            if (hasChanges) build = target.concat(source);
        }

        // maybe treatment 3 - value is like string of arrays compared? so if its changed take the source array?


        if (hasChanges && options.hasOwnProperty(parentKey)) {
            var optionsThis = options[parentKey];
            if (optionsThis.hasOwnProperty('sortBy')) build.sort(optionsThis.sortBy);
        }
    } else {
        // its object
        build = (0, _assign2.default)({}, target); // because i dont iterate target's keys, and source can have missing keys

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)((0, _entries2.default)(source)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _step2$value = (0, _slicedToArray3.default)(_step2.value, 2),
                    sourceKey = _step2$value[0],
                    _sourceValue3 = _step2$value[1];

                if (target.hasOwnProperty(sourceKey)) {
                    var sourceValueType = specialTypeOf(_sourceValue3);
                    var _targetValue2 = target[sourceKey];
                    var targetValueType = specialTypeOf(_targetValue2);
                    if (sourceValueType !== targetValueType) {
                        // type changed
                        build[sourceKey] = _sourceValue3;
                        hasChanges = true;
                    } else if (nonRefTypes.includes(sourceValueType)) {
                        // targetValueType and sourceValueType are same
                        build[sourceKey] = _sourceValue3;
                        if (build[sourceKey] !== _targetValue2) hasChanges = true;
                    } else {
                        // targetValueType and sourceValueType are same - and both array or object
                        build[sourceKey] = mergeJsonDeepWithRefs(_targetValue2, _sourceValue3, options, sourceKey);
                        if (build[sourceKey] !== _targetValue2) hasChanges = true;
                    }
                } else {
                    build[sourceKey] = _sourceValue3;
                    hasChanges = true;
                }
            }
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

    if (!hasChanges) {
        return target;
    } else {
        return build;
    }
}