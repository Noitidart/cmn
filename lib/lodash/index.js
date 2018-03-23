'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = keepUnchangedRefsOnly;

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://stackoverflow.com/a/49437903/1828637
// used to be mergeWith customizer, but mergeWith doesnt allow setting undefined, so changed to assignWith customizer
// assignWith customizer.
// by default assignWith keeps refs to everything,
// this customizer makes it so that ref is only kept if unchanged
// and a shallow copy is made if changed. this shallow copy continues deeply.
// supports arrays of collections (by id).
function keepUnchangedRefsOnly(objValue, srcValue) {
    if (objValue === undefined) {
        // do i need this?
        return srcValue;
    } else if ((0, _lodash.isPlainObject)(objValue)) {
        return assignWith({}, objValue, srcValue, keepUnchangedRefsOnly);
    } else if (Array.isArray(objValue)) {
        if ((0, _lodash.isEmpty)(objValue) && !(0, _lodash.isEmpty)(srcValue)) return [].concat((0, _toConsumableArray3.default)(srcValue));else if (!(0, _lodash.isEmpty)(objValue) && (0, _lodash.isEmpty)(srcValue)) return objValue;else if ((0, _lodash.isEmpty)(objValue) && (0, _lodash.isEmpty)(srcValue)) return objValue; // both empty
        else {
                // if array is array of objects, then assume each object has id, and merge based on id
                // so create new array, based objValue. id should match in each spot

                if ((0, _lodash.isPlainObject)(objValue[0]) && objValue[0].hasOwnProperty('id')) {
                    var srcCollection = (0, _lodash.keyBy)(srcValue, 'id');

                    var aligned = objValue.map(function (el) {
                        var id = el.id;

                        if (srcCollection.hasOwnProperty(id)) {
                            var srcEl = srcCollection[id];
                            delete srcCollection[id];
                            return assignWith({}, el, srcEl, keepUnchangedRefsOnly);
                        } else {
                            return el;
                        }
                    });

                    aligned.push.apply(aligned, (0, _toConsumableArray3.default)((0, _values2.default)(srcCollection)));

                    return aligned;
                } else {
                    return [].concat((0, _toConsumableArray3.default)(objValue), (0, _toConsumableArray3.default)(srcValue));
                }
            }
    }
}