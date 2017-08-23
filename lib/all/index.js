'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.wait = exports.retry = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var retry = exports.retry = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(callback) {
        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            cnt = _ref3.cnt,
            sec = _ref3.sec,
            _ref3$interval = _ref3.interval,
            interval = _ref3$interval === undefined ? 1000 : _ref3$interval;

        var STOP_KEYWORD, FAILED_KEYWORD, retries;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (cnt === undefined && sec === undefined) cnt = 10;

                        // either supply cnt or sec
                        // set sec or cnt to 0 if you want to try endlessly
                        // if neither supplied default is 10 retries
                        // interval is ms, defauls to 1000

                        // callback should return promise
                        // throw new Error('STOP' + message) in order to stop retrying and throw the `message`
                        // throw new Error() to just say it failed, it will keep retrying
                        // callback gets one arg, which is try number, base 0

                        // promise resolved or rejected with new Error(FAILED_KEYWORD)

                        // set cnt
                        if (cnt === 0 || sec === 0) cnt = Infinity;else if (sec) cnt = Math.max(Math.floor(sec * 1000 / interval), 1);

                        STOP_KEYWORD = 'STOP';
                        FAILED_KEYWORD = 'FAIL';
                        retries = 0;

                    case 5:
                        if (!(retries < cnt)) {
                            _context.next = 27;
                            break;
                        }

                        _context.prev = 6;
                        _context.next = 9;
                        return callback(retries);

                    case 9:
                        return _context.abrupt('return', _context.sent);

                    case 12:
                        _context.prev = 12;
                        _context.t0 = _context['catch'](6);

                        if (!_context.t0.message.startsWith(STOP_KEYWORD)) {
                            _context.next = 18;
                            break;
                        }

                        throw new Error(_context.t0.message.substr(STOP_KEYWORD.length));

                    case 18:
                        if (!(++retries < cnt)) {
                            _context.next = 24;
                            break;
                        }

                        console.log(_context.t0.message);
                        _context.next = 22;
                        return wait(interval);

                    case 22:
                        _context.next = 25;
                        break;

                    case 24:
                        throw new Error(FAILED_KEYWORD);

                    case 25:
                        _context.next = 5;
                        break;

                    case 27:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[6, 12]]);
    }));

    return function retry(_x2) {
        return _ref2.apply(this, arguments);
    };
}();

// https://stackoverflow.com/a/1499916/1828637


var wait = exports.wait = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(ms) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return new _promise2.default(function (resolve) {
                            return setTimeout(function () {
                                return resolve();
                            }, ms);
                        });

                    case 2:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function wait(_x4) {
        return _ref4.apply(this, arguments);
    };
}();

// https://stackoverflow.com/a/36566052/1828637


exports.average = average;
exports.alphaSort = alphaSort;
exports.arrayToObject = arrayToObject;
exports.compareInt = compareInt;
exports.compareIntThenLex = compareIntThenLex;
exports.calcSalt = calcSalt;
exports.deepAccessUsingString = deepAccessUsingString;
exports.dedupeCaseInsensitive = dedupeCaseInsensitive;
exports.deepSetUsingString = deepSetUsingString;
exports.escapeRegex = escapeRegex;
exports.findClosestLocale = findClosestLocale;
exports.genNonce = genNonce;
exports.isObject = isObject;
exports.isObjectEmpty = isObjectEmpty;
exports.mapTruthy = mapTruthy;
exports.pick = pick;
exports.pickDotpath = pickDotpath;
exports.pushAlternating = pushAlternating;
exports.randBetween = randBetween;
exports.stripTags = stripTags;
exports.sum = sum;
exports.timeout = timeout;
exports.toTitleCase = toTitleCase;
exports.urldecode = urldecode;
exports.urlencode = urlencode;
exports.wordSimilarity = wordSimilarity;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function average(arr) {
    return sum(arr) / arr.length;
}

function alphaSort(a, b) {
    return a.localeCompare(b);
}

arrayToObject.getKey = function (el, extractor) {
    if (!extractor) return el;else if (typeof extractor === 'string') return el[extractor]; // assumes is an object
    else return extractor(el); // assumes extractor is a function
};
function arrayToObject(arr, keyExtractor) {
    // keyExtractor can be:
    // undefined/falsy to just return array element
    // string - extract one level deep from object
    // function - function that gets args of (arrayElement, index), must return string
    // turns elements into keys in object
    return arr.reduce(function (acc, el, ix) {
        var key = arrayToObject.getKey(el, keyExtractor);
        acc[key] = el;
        return acc;
    }, {});
}

function compareInt(a, b) {
    // sort asc by integer
    return a - b; // sort asc
}
function compareIntThenLex(a, b) {
    // sort ascending by integer, and then lexically
    // ['1', '10', '2'] ->
    // ['1', '2', '10']

    var inta = parseInt(a, 10);
    var intb = parseInt(b, 10);
    var isaint = !isNaN(inta);
    var isbint = !isNaN(intb);
    if (isaint && isbint) {
        return inta - intb; // sort asc
    } else if (isaint && !isbint) {
        return -1; // sort a to lower index then b
    } else if (!isaint && isbint) {
        return 1; // sort b to lower index then a
    } else {
        // neither are int's
        return a.localeCompare(b);
    }
}

function calcSalt() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$sensitive = _ref.sensitive,
        sensitive = _ref$sensitive === undefined ? false : _ref$sensitive,
        _ref$len = _ref.len,
        len = _ref$len === undefined ? 8 : _ref$len;

    // salt generator from http://mxr.mozilla.org/mozilla-aurora/source/toolkit/profile/content/createProfileWizard.js?raw=1*/

    var mozKSaltTable = sensitive ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    var kSaltString = '';
    for (var i = 0; i < len; ++i) {
        kSaltString += mozKSaltTable[Math.floor(Math.random() * mozKSaltTable.length)];
    }
    return kSaltString;
    // return kSaltString + '.' + aName;
}

function deepAccessUsingString(obj, dotpath, defaultval) {
    // defaultval is returned when it is not found, by default, defaultval is undefined, set it to "THROW" if you want it to throw

    // super simple version:
    // const deepAccessUsingString = (obj, dotpath) => dotpath.split('.').reduce((nested, key) => nested[key], obj);

    var keys = dotpath.split('.');
    var nested = obj;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            if (nested && key in nested) nested = nested[key]; // `key in nested` this is point of concern. as `in` works with Array,Set,Map (and i dont know maybe more type) too. i am assuming that nested is always an object
            else if (defaultval === 'THROW') throw new Error('deepAccessUsingString: missing "' + dotpath + '"');else return defaultval;
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

    return nested;
}

function dedupeCaseInsensitive(arr) {
    // removes duplicates in array. case insensitively.
    // based on "Hashtables to the rescue" - http://stackoverflow.com/a/9229821/1828637
    var ixlast = arr.length - 1;
    return arr.reduce(function (acc, el, ix) {
        var el_low = el.toLowerCase();
        var seen = acc.seen,
            filtered = acc.filtered;

        if (!seen.hasOwnProperty(el_low)) {
            seen[el_low] = true;
            filtered.push(el);
        }
        return ix === ixlast ? filtered : acc;
    }, { seen: {}, filtered: [] });
}

function deepSetUsingString(obj, dotpath, newval) {
    // throws if set fails
    // may want to update to - http://stackoverflow.com/a/13719799/1828637

    var stack = dotpath.split('.');

    var nesteddotpath = [];
    while (stack.length > 1) {
        var dot = stack.shift();
        nesteddotpath.push(dot);
        obj = obj[dot];
        if (!isObject(obj)) throw new Error('Found non object at dot path level of "' + nesteddotpath.join('.') + '". Instead of object, it is "' + obj.toString() + '". Was trying to set full dotpath of "' + dotpath + '".');
    }

    obj[stack.shift()] = newval;

    // let keys = dotpath.split('.');
    // let nested = obj;
    // let nesteddotpath = [];
    // for (let key of keys) {
    //     if (!isObject(nested)) throw new Error(`Found non object at dot path level of "${nesteddotpath.join('.')}". Instead of object, it is "${nested.toString()}". Was trying to set full dotpath of "${dotpath}".`);

    //     nesteddotpath.push(key);
    //     nested = nested[key];
    // }
    // nested = newval;
}

function escapeRegex(text) {
    var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
    var sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
    return text.replace(sRE, '\\$1');
    // if (!arguments.callee.sRE) {
    // 	var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
    // 	arguments.callee.sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
    // }
    // return text.replace(arguments.callee.sRE, '\\$1');
}

/**
 * Selects the closest matching locale from a list of locales.
 *
 * @param  aLocales
 *         An array of available locales
 * @param  aMatchLocales
 *         An array of prefered locales, ordered by priority. Most wanted first.
 *         Locales have to be in lowercase.
 * @return the best match for the currently selected locale
 *
 * Stolen from http://mxr.mozilla.org/mozilla-central/source/toolkit/mozapps/extensions/internal/XPIProvider.jsm
 */
function findClosestLocale(aLocales, aMatchLocales) {

    // Holds the best matching localized resource
    var bestmatch = null;
    // The number of locale parts it matched with
    var bestmatchcount = 0;
    // The number of locale parts in the match
    var bestpartcount = 0;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)(aMatchLocales), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var locale = _step2.value;

            var lparts = locale.split(/[-_]/);
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(aLocales), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var localized = _step3.value;

                    var found = localized.toLowerCase();
                    // Exact match is returned immediately
                    if (locale === found) return localized;

                    var fparts = found.split(/[-_]/);
                    /* If we have found a possible match and this one isn't any longer
                       then we dont need to check further. */
                    if (bestmatch && fparts.length < bestmatchcount) continue;

                    // Count the number of parts that match
                    var maxmatchcount = Math.min(fparts.length, lparts.length);
                    var matchcount = 0;
                    while (matchcount < maxmatchcount && fparts[matchcount] === lparts[matchcount]) {
                        matchcount++;
                    } /* If we matched more than the last best match or matched the same and
                         this locale is less specific than the last best match. */
                    if (matchcount > bestmatchcount || matchcount === bestmatchcount && fparts.length < bestpartcount) {
                        bestmatch = localized;
                        bestmatchcount = matchcount;
                        bestpartcount = fparts.length;
                    }
                }
                // If we found a valid match for this locale return it
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            if (bestmatch) return bestmatch;
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

    return null;
}

function genNonce(length) {
    // generates a nonce
    var nonce = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        nonce += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return nonce;
}

function isObject(avar) {
    // cosntructor.name tested for `function Animal(){}; var a = new Animal(); isObject(a);` will return true otherwise as it is [Object object]
    return Object.prototype.toString.call(avar) === '[object Object]' && avar.constructor.name === 'Object';
}

function isObjectEmpty(obj) {
    // https://stackoverflow.com/a/32108184/1828637
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
    }

    return true;
}

function mapTruthy(target, mapper) {
    // target is array
    // mapper gets same args Array.prototype.map gets, currentValue, index, array
    // if element in array is undefined/null/false/0, it is skipped
    return target.reduce(function (acc, el, ix) {
        if (el) acc.push(mapper(el, ix, acc));
        return acc;
    }, []);
}

// https://stackoverflow.com/q/25553910/1828637
function pick(obj) {
    var picked = {};

    for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        keys[_key - 1] = arguments[_key];
    }

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = (0, _getIterator3.default)(keys), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var key = _step4.value;

            picked[key] = obj[key];
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }
}

function pickDotpath(obj) {
    // can do dotpath + ' as BLAH'
    var picked = {};

    for (var _len2 = arguments.length, dotpaths = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        dotpaths[_key2 - 1] = arguments[_key2];
    }

    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = (0, _getIterator3.default)(dotpaths), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var dotpath = _step5.value;

            var asKey = void 0;
            var asIx = dotpath.indexOf(' as ');
            if (asIx > -1) {
                asKey = dotpath.substr(asIx + 5);
                dotpath = dotpath.substr(0, asIx);
            }
            var _keys = dotpath.split('.');
            if (!asKey) asKey = _keys[_keys.length - 1];
            if (_keys.length > 1) picked[asKey] = deepAccessUsingString(obj, dotpath);else picked[asKey] = obj[dotpath];
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }
}

function pushAlternating(aTargetArr, aEntry) {
    // mutates aTargetArr
    // pushes into an array aEntry, every alternating
    // so if aEntry 0
    // [1, 2] becomes [1, 0, 2]
    // [1] statys [1]
    // [1, 2, 3] becomes [1, 0, 2, 0, 3]
    var l = aTargetArr.length;
    for (var i = l - 1; i > 0; i--) {
        aTargetArr.splice(i, 0, aEntry);
    }

    return aTargetArr;
}

function randBetween(min, max) {
    // short for randomizeBetween
    // TODO: add precission option, right now default is 0 so just integer
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function stripTags(html) {
    // html is text
    return html.replace(/(<([^>]+)>)/ig, '');
}

function sum(arr) {
    return arr.reduce(function (sum, x) {
        return sum + x;
    });
}

// https://github.com/github/fetch/issues/175#issuecomment-284787564
// timeout a promise
function timeout(ms, promise) {
    return new _promise2.default(function (resolve, reject) {
        setTimeout(function () {
            return reject(new Error('TIMEOUT'));
        }, ms);
        promise.then(resolve, reject);
    });
}

// http://stackoverflow.com/q/196972/1828637
// consider not proper casing small words - http://php.net/manual/en/function.ucwords.php#84920 - ['of','a','the','and','an','or','nor','but','is','if','then', 'else','when', 'at','from','by','on','off','for','in','out', 'over','to','into','with'];
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function urldecode(str) {
    //       discuss at: http://locutus.io/php/urldecode/
    //      original by: Philip Peterson
    //      improved by: Kevin van Zonneveld (http://kvz.io)
    //      improved by: Kevin van Zonneveld (http://kvz.io)
    //      improved by: Brett Zamir (http://brett-zamir.me)
    //      improved by: Lars Fischer
    //      improved by: Orlando
    //      improved by: Brett Zamir (http://brett-zamir.me)
    //      improved by: Brett Zamir (http://brett-zamir.me)
    //         input by: AJ
    //         input by: travc
    //         input by: Brett Zamir (http://brett-zamir.me)
    //         input by: Ratheous
    //         input by: e-mike
    //         input by: lovio
    //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
    //      bugfixed by: Rob
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    //           note 1: info on what encoding functions to use from:
    //           note 1: http://xkr.us/articles/javascript/encode-compare/
    //           note 1: Please be aware that this function expects to decode
    //           note 1: from UTF-8 encoded strings, as found on
    //           note 1: pages served as UTF-8
    //        example 1: urldecode('Kevin+van+Zonneveld%21')
    //        returns 1: 'Kevin van Zonneveld!'
    //        example 2: urldecode('http%3A%2F%2Fkvz.io%2F')
    //        returns 2: 'http://kvz.io/'
    //        example 3: urldecode('http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a')
    //        returns 3: 'http://www.google.nl/search?q=Locutus&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a'
    //        example 4: urldecode('%E5%A5%BD%3_4')
    //        returns 4: '\u597d%3_4'
    return decodeURIComponent((str + '').replace(/%(?![\da-f]{2})/gi, function () {
        // PHP tolerates poorly formed escape sequences
        return '%25';
    }).replace(/\+/g, '%20'));
}

function urlencode(str) {
    //       discuss at: http://locutus.io/php/urlencode/
    //      original by: Philip Peterson
    //      improved by: Kevin van Zonneveld (http://kvz.io)
    //      improved by: Kevin van Zonneveld (http://kvz.io)
    //      improved by: Brett Zamir (http://brett-zamir.me)
    //      improved by: Lars Fischer
    //         input by: AJ
    //         input by: travc
    //         input by: Brett Zamir (http://brett-zamir.me)
    //         input by: Ratheous
    //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
    //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
    //      bugfixed by: Joris
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    //           note 1: This reflects PHP 5.3/6.0+ behavior
    //           note 1: Please be aware that this function
    //           note 1: expects to encode into UTF-8 encoded strings, as found on
    //           note 1: pages served as UTF-8
    //        example 1: urlencode('Kevin van Zonneveld!')
    //        returns 1: 'Kevin+van+Zonneveld%21'
    //        example 2: urlencode('http://kvz.io/')
    //        returns 2: 'http%3A%2F%2Fkvz.io%2F'
    //        example 3: urlencode('http://www.google.nl/search?q=Locutus&ie=utf-8')
    //        returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8'
    str = str + '';
    // Tilde should be allowed unescaped in future versions of PHP (as reflected below),
    // but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

function wordSimilarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0) costs[j] = j;else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}