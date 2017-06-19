(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("cmn", [], factory);
	else if(typeof exports === 'object')
		exports["cmn"] = factory();
	else
		root["cmn"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.alphaSort = alphaSort;
exports.compareInt = compareInt;
exports.compareIntThenLex = compareIntThenLex;
exports.calcSalt = calcSalt;
exports.deepAccessUsingString = deepAccessUsingString;
exports.dedupeCaseInsensitive = dedupeCaseInsensitive;
exports.deepSetUsingString = deepSetUsingString;
exports.escapeRegex = escapeRegex;
exports.findClosestLocale = findClosestLocale;
exports.isObject = isObject;
exports.mapTruthy = mapTruthy;
exports.retry = retry;
exports.timeout = timeout;
exports.toTitleCase = toTitleCase;
exports.wait = wait;
exports.pushAlternating = pushAlternating;
exports.genNonce = genNonce;
function alphaSort(a, b) {
    return a.localeCompare(b);
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

function calcSalt(_ref) {
    var _ref$sensitive = _ref.sensitive,
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
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
        for (var _iterator2 = aMatchLocales[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var locale = _step2.value;

            var lparts = locale.split(/[-_]/);
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = aLocales[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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

function isObject(avar) {
    // cosntructor.name tested for `function Animal(){}; var a = new Animal(); isObject(a);` will return true otherwise as it is [Object object]
    return Object.prototype.toString.call(avar) === '[object Object]' && avar.constructor.name === 'Object';
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

async function retry(callback) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        cnt = _ref2.cnt,
        sec = _ref2.sec,
        _ref2$interval = _ref2.interval,
        interval = _ref2$interval === undefined ? 1000 : _ref2$interval;

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

    var STOP_KEYWORD = 'STOP';
    var FAILED_KEYWORD = 'FAIL';

    var retries = 0;
    while (retries < cnt) {
        try {
            return await callback(retries);
        } catch (err) {
            // STOP_RETRIES short for STOP_RETRIES_AND_THROW
            if (err.message.startsWith(STOP_KEYWORD)) throw new Error(err.message.substr(STOP_KEYWORD.length));else if (++retries < cnt) {
                console.log(err.message);
                await wait(interval);
            } else throw new Error(FAILED_KEYWORD);
        }
    }
}

// https://github.com/github/fetch/issues/175#issuecomment-284787564
// timeout a promise
function timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
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

async function wait(ms) {
    await new Promise(function (resolve) {
        return setTimeout(function () {
            return resolve();
        }, ms);
    });
}

function pushAlternating(aTargetArr, aEntry) {
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

function genNonce(length) {
    // generates a nonce
    var nonce = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        nonce += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return nonce;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getUserPreferredLocales = getUserPreferredLocales;
exports.getClosestAvailableLocale = getClosestAvailableLocale;
exports.getSelectedLocale = getSelectedLocale;
exports.storageCall = storageCall;

var _fetchPolyfill = __webpack_require__(4);

var _fetchPolyfill2 = _interopRequireDefault(_fetchPolyfill);

var _all = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// requires extension-polyfill.js

//scope: webextension background.js
// collection requirements:
// global `core.stg = {}`
// _locales/[LOCALE_TAG]/ directories
// all.js - findClosestLocale
// messages.json in _locales/** directories

// REQUIREMENTS:
// all.js - dedupeCaseInsensitive
async function getUserPreferredLocales() {
	// returns an array with the locales of the user. first entry is most highly preferred. after that is less
	var userlocale_preferred = extension.i18n.getUILanguage(); // same as `extension.i18n.getMessage('@@ui_locale')`
	var userlocale_lesspreferred = await extensiona('i18n.getAcceptLanguages')();

	var userlocales = [userlocale_preferred].concat(_toConsumableArray(userlocale_lesspreferred));

	// remove duplicates, case insensitively
	return (0, _all.dedupeCaseInsensitive)(userlocales);
}

// REQUIREMENTS:
// all.js - findClosestLocale
async function getClosestAvailableLocale(extlocales) {
	// gets the locale available in my extension, that is closest to the users locale
	// returns null if nothing close

	// lower case things because thats what findClosestLocale needs
	var userlocales = await getUserPreferredLocales();

	var available = extlocales;
	var wanted = userlocales.map(function (el) {
		return el.toLowerCase();
	}); // findClosestLocale needs it lower case

	return (0, _all.findClosestLocale)(available, wanted); // returns `null` if not found
}

// REQUIREMENTS
// messages.json in _locales/** directories
async function getSelectedLocale(extlocales, testkey) {
	// returns the locale in my extension, that is being used by the browser, to display my extension stuff
	// testkey - string of key common to all messages.json files - will collect this message from each of the extlocales, then see what extension.i18n.getMessage(testkey) is equal to
	// REQUIRED: pick a `testkey` that has a unique value in each message.json file

	var errors = [];
	var msgs = {}; // localized_messages `[messages.json[testkey]]: extlocale`
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = extlocales[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var extlocale = _step.value;

			console.log('going to fetch messages.json for extlocale:', extlocale);
			var res = await (0, _fetchPolyfill2.default)('/_locales/' + extlocale + '/messages.json');
			console.log('res:', res);
			var json = await res.json();
			console.log('json:', json);
			var msg = json[testkey].message;
			console.log('msg:', msg);

			if (msg in msgs) errors.push('* messages.json for locale "' + extlocale + '" has the same "message" as locale ' + msgs[msg] + ' for `testkey`("' + testkey + '")');else msgs[msg] = extlocale;
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

	if (errors.length) throw 'ERROR(getSelectedLocale):\n' + errors.join('\n');

	return msgs[extension.i18n.getMessage(testkey)];
}

// rev3 - not yet comit - https://gist.github.com/Noitidart/bcb964207ac370d3301720f3d5c9eb2b
// REQUIREMENTS:
// global `core.stg = {}`
var _storagecall_pendingset = {};
var _storagecall_callid = 1;
function storageCall(aArea, aAction, aKeys, aOptions) {
	if ((0, _all.isObject)(aArea)) {
		;
		var _aArea = aArea;
		aArea = _aArea.aArea;
		aAction = _aArea.aAction;
		aKeys = _aArea.aKeys;
		aOptions = _aArea.aOptions;
	} // because storage can fail, i created this, which goes until it doesnt fail

	// aAction - string;enum[set,get,clear,remove]
	// aKeys -
	// if aAction "clear" then ignore
	// if aAction "remove" then string/string[]
	// if aAction "get" then null/string/string[]
	// if aAction "set" then object
	// aOptions - object
	// maxtries - int;default:0 - set to 0 if you want it to try infinitely
	// timebetween - int;default:50 - milliseconds
	// core - reference to core

	aOptions = aOptions ? aOptions : {};
	var maxtries = aOptions.maxtries || 0;
	var timebetween = aOptions.timebetween || 50;
	var core = aOptions.core;

	var callid = _storagecall_callid++; // the id of this call to `storageCall` // only used for when `aAction` is "set"

	if (aAction === 'set') {
		// see if still trying to set any of these keys
		for (var setkey in aKeys) {
			_storagecall_pendingset[setkey] = callid;
		}
	}
	return new Promise(function (resolve, reject) {
		// start asnc-proc49399
		var trycnt = 0;

		var call = function call() {
			switch (aAction) {
				case 'clear':
					extension('storage.' + aArea + '.' + aAction)(check);
					break;
				case 'set':
					// special processing
					// start - block-link3191
					// make sure that each this `callid` is still responsible for setting in `aKeys`
					for (var setkey in aKeys) {
						if (_storagecall_pendingset[setkey] !== callid) {
							delete aKeys[setkey];
						}
					}
					// end - block-link3191
					if (!Object.keys(aKeys).length) resolve(); // no longer responsible, as another call to set - with the keys that this callid was responsible for - has been made, so lets say it succeeded // i `resolve` and not `reject` because, say i was still responsible for one of the keys, when that completes it will `resolve`
					else extension('storage.' + aArea + '.' + aAction)(aKeys, check);
					break;
				default:
					extension('storage.' + aArea + '.' + aAction)(aKeys, check);
			}
		};

		var check = function check(arg1) {
			if (extension.runtime.lastError) {
				if (!maxtries || trycnt++ < maxtries) setTimeout(call, timebetween);else reject(extension.runtime.lastError); // `maxtries` reached
			} else {
				switch (aAction) {
					case 'clear':
					case 'remove':
						// callback `check` triggred with no arguments
						resolve();
						break;
					case 'set':
						// callback `check` triggred with no arguments - BUT special processing

						// race condition I THINK - because i think setting storage internals is async - so what if another call came in and did the set while this one was in between `call` and `check`, so meaningi t was processing - and then this finished processing AFTER a new call to `storageCall('', 'set'` happend
						// copy - block-link3191
						// make sure that each this `callid` is still responsible for setting in `aKeys`
						for (var _setkey in aKeys) {
							if (_storagecall_pendingset[_setkey] !== callid) {
								delete aKeys[_setkey];
							}
						}
						// end copy - block-link3191

						// remove keys from `_storagecall_pendingset`
						for (var _setkey2 in aKeys) {
							// assuming _storagecall_pendingset[setkey] === callid
							delete _storagecall_pendingset[_setkey2];
						}

						// SPECIAL - udpate core.stg
						if ((0, _all.isObject)(core) && core.stg) {
							for (var _setkey3 in aKeys) {
								if (_setkey3 in core.stg) core.stg[_setkey3] = aKeys[_setkey3];
							}
						}

						resolve(aKeys);
						break;
					case 'get':
						// callback `check` triggred with 1 argument
						var stgeds = arg1;
						resolve(stgeds);
						break;
				}
				resolve(stgeds);
			}
		};

		call();
		// end asnc-proc49399
	});
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.toRFC3986 = toRFC3986;

var _utils = __webpack_require__(7);

var _formats = __webpack_require__(6);

function toRFC3986(str) {
	return _formats.formatters['RFC3986']((0, _utils.encode)(str));
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = fetch;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var awaitable = function () {
    function awaitable(xhr) {
        _classCallCheck(this, awaitable);

        this.xhr = xhr;
    }

    _createClass(awaitable, [{
        key: 'json',
        value: function json() {
            var _this = this;

            return new Promise(function (resolve) {
                return resolve(JSON.parse(_this.xhr.responseText));
            });
        }
    }, {
        key: 'text',
        value: function text() {
            var _this2 = this;

            return new Promise(function (resolve) {
                return resolve(_this2.xhr.responseText);
            });
        }
    }]);

    return awaitable;
}();

function fetch(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'text';
        xhr.onload = function () {
            // console.log(xhr.responseText);
            resolve(new awaitable(xhr));
        };
        xhr.onerror = function () {
            reject('failed');
        };
        xhr.onabort = function () {
            reject('aborted');
        };
        xhr.open("GET", url);
        xhr.send();
    });
}
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _all = __webpack_require__(0);

Object.defineProperty(exports, 'all', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_all).default;
  }
});

var _dom = __webpack_require__(2);

Object.defineProperty(exports, 'dom', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_dom).default;
  }
});

var _background = __webpack_require__(1);

Object.defineProperty(exports, 'background', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_background).default;
  }
});

var _qs = __webpack_require__(3);

Object.defineProperty(exports, 'qs', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_qs).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Library = function () {
  function Library() {
    _classCallCheck(this, Library);

    this._name = 'Library';
  }

  _createClass(Library, [{
    key: 'name',
    get: function get() {
      return this._name;
    }
  }]);

  return Library;
}();

exports.default = Library;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

module.exports = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

exports.arrayToObject = function (source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

exports.merge = function (target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = exports.arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && typeof target[i] === 'object') {
                    target[i] = exports.merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (Object.prototype.hasOwnProperty.call(acc, key)) {
            acc[key] = exports.merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

exports.decode = function (str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

exports.encode = function (str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D || // -
            c === 0x2E || // .
            c === 0x5F || // _
            c === 0x7E || // ~
            (c >= 0x30 && c <= 0x39) || // 0-9
            (c >= 0x41 && c <= 0x5A) || // a-z
            (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)] + hexTable[0x80 | ((c >> 12) & 0x3F)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]; // eslint-disable-line max-len
    }

    return out;
};

exports.compact = function (obj, references) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    var refs = references || [];
    var lookup = refs.indexOf(obj);
    if (lookup !== -1) {
        return refs[lookup];
    }

    refs.push(obj);

    if (Array.isArray(obj)) {
        var compacted = [];

        for (var i = 0; i < obj.length; ++i) {
            if (obj[i] && typeof obj[i] === 'object') {
                compacted.push(exports.compact(obj[i], refs));
            } else if (typeof obj[i] !== 'undefined') {
                compacted.push(obj[i]);
            }
        }

        return compacted;
    }

    var keys = Object.keys(obj);
    keys.forEach(function (key) {
        obj[key] = exports.compact(obj[key], refs);
    });

    return obj;
};

exports.isRegExp = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

exports.isBuffer = function (obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};


/***/ })
/******/ ]);
});
//# sourceMappingURL=cmn.js.map