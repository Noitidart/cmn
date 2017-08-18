'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getSelectedLocale = exports.getClosestAvailableLocale = exports.getUserPreferredLocales = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// requires extension-polyfill.js

//scope: webextension background.js
// collection requirements:
// global `core.stg = {}`
// _locales/[LOCALE_TAG]/ directories
// all.js - findClosestLocale
// messages.json in _locales/** directories

// REQUIREMENTS:
// all.js - dedupeCaseInsensitive
var getUserPreferredLocales = exports.getUserPreferredLocales = function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
		var userlocale_preferred, userlocale_lesspreferred, userlocales;
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						// returns an array with the locales of the user. first entry is most highly preferred. after that is less
						userlocale_preferred = extension.i18n.getUILanguage(); // same as `extension.i18n.getMessage('@@ui_locale')`

						_context.next = 3;
						return extensiona('i18n.getAcceptLanguages')();

					case 3:
						userlocale_lesspreferred = _context.sent;
						userlocales = [userlocale_preferred].concat((0, _toConsumableArray3.default)(userlocale_lesspreferred));

						// remove duplicates, case insensitively

						return _context.abrupt('return', (0, _all.dedupeCaseInsensitive)(userlocales));

					case 6:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function getUserPreferredLocales() {
		return _ref.apply(this, arguments);
	};
}();

// REQUIREMENTS:
// all.js - findClosestLocale


var getClosestAvailableLocale = exports.getClosestAvailableLocale = function () {
	var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(extlocales) {
		var userlocales, available, wanted;
		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return getUserPreferredLocales();

					case 2:
						userlocales = _context2.sent;
						available = extlocales;
						wanted = userlocales.map(function (el) {
							return el.toLowerCase();
						}); // findClosestLocale needs it lower case

						return _context2.abrupt('return', (0, _all.findClosestLocale)(available, wanted));

					case 6:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function getClosestAvailableLocale(_x) {
		return _ref2.apply(this, arguments);
	};
}();

// REQUIREMENTS
// messages.json in _locales/** directories


var getSelectedLocale = exports.getSelectedLocale = function () {
	var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(extlocales, testkey) {
		var errors, msgs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, extlocale, res, json, msg;

		return _regenerator2.default.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						// returns the locale in my extension, that is being used by the browser, to display my extension stuff
						// testkey - string of key common to all messages.json files - will collect this message from each of the extlocales, then see what extension.i18n.getMessage(testkey) is equal to
						// REQUIRED: pick a `testkey` that has a unique value in each message.json file

						errors = [];
						msgs = {}; // localized_messages `[messages.json[testkey]]: extlocale`

						_iteratorNormalCompletion = true;
						_didIteratorError = false;
						_iteratorError = undefined;
						_context3.prev = 5;
						_iterator = (0, _getIterator3.default)(extlocales);

					case 7:
						if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
							_context3.next = 24;
							break;
						}

						extlocale = _step.value;

						console.log('going to fetch messages.json for extlocale:', extlocale);
						_context3.next = 12;
						return (0, _fetchPolyfill2.default)('/_locales/' + extlocale + '/messages.json');

					case 12:
						res = _context3.sent;

						console.log('res:', res);
						_context3.next = 16;
						return res.json();

					case 16:
						json = _context3.sent;

						console.log('json:', json);
						msg = json[testkey].message;

						console.log('msg:', msg);

						if (msg in msgs) errors.push('* messages.json for locale "' + extlocale + '" has the same "message" as locale ' + msgs[msg] + ' for `testkey`("' + testkey + '")');else msgs[msg] = extlocale;

					case 21:
						_iteratorNormalCompletion = true;
						_context3.next = 7;
						break;

					case 24:
						_context3.next = 30;
						break;

					case 26:
						_context3.prev = 26;
						_context3.t0 = _context3['catch'](5);
						_didIteratorError = true;
						_iteratorError = _context3.t0;

					case 30:
						_context3.prev = 30;
						_context3.prev = 31;

						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}

					case 33:
						_context3.prev = 33;

						if (!_didIteratorError) {
							_context3.next = 36;
							break;
						}

						throw _iteratorError;

					case 36:
						return _context3.finish(33);

					case 37:
						return _context3.finish(30);

					case 38:
						if (!errors.length) {
							_context3.next = 40;
							break;
						}

						throw 'ERROR(getSelectedLocale):\n' + errors.join('\n');

					case 40:
						return _context3.abrupt('return', msgs[extension.i18n.getMessage(testkey)]);

					case 41:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this, [[5, 26, 30, 38], [31,, 33, 37]]);
	}));

	return function getSelectedLocale(_x2, _x3) {
		return _ref3.apply(this, arguments);
	};
}();

// rev3 - not yet comit - https://gist.github.com/Noitidart/bcb964207ac370d3301720f3d5c9eb2b
// REQUIREMENTS:
// global `core.stg = {}`


exports.storageCall = storageCall;

var _fetchPolyfill = require('../fetch-polyfill');

var _fetchPolyfill2 = _interopRequireDefault(_fetchPolyfill);

var _all = require('../all');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	return new _promise2.default(function (resolve, reject) {
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
					if (!(0, _keys2.default)(aKeys).length) resolve(); // no longer responsible, as another call to set - with the keys that this callid was responsible for - has been made, so lets say it succeeded // i `resolve` and not `reject` because, say i was still responsible for one of the keys, when that completes it will `resolve`
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