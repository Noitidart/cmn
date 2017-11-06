'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.callInTemplate = callInTemplate;
exports.isObject = isObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deepAccessUsingString = function deepAccessUsingString(obj, dotpath) {
    return dotpath.split('.').reduce(function (nested, key) {
        return nested[key];
    }, obj);
};

var Base = function () {
    // short for multiclient_server

    // private to comm - even extenders dont touch this
    function Base(aTarget, aMethods, onHandshake) {
        var _this = this;

        (0, _classCallCheck3.default)(this, Base);
        this.target = null;
        this.scope = null;
        this.onHandshake = undefined;
        this.receptacle = {};
        this.nextcbid = 1;
        this.isunregistered = false;
        this.multiclient = false;
        this.cantransfer = false;
        this.commname = 'Unnamed';
        this.onUnregister = { // onPortDisconnect
            handlers: [],
            addListener: function addListener(handler) {
                // returns true if added, else false if already there
                if (!this.handlers.includes(handler)) {
                    this.handlers.push(handler);
                    return true;
                }
                return false;
            },
            removeListener: function removeListener(handler) {
                // returns true if removed, else false if it was never there
                var ix = this.handlers.indexOf(handler);
                if (ix > -1) {
                    this.handlers.splice(ix, 1);
                    return true;
                }
                return false;
            }
        };

        this.sendMessage = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var aClientId = void 0,
                aMethod = void 0,
                aArg = void 0,
                aCallback = void 0;
            if (_this.multiclient) {
                aClientId = args[0];
                aMethod = args[1];
                aArg = args[2];
                aCallback = args[3];
            } else {
                aMethod = args[0];
                aArg = args[1];
                aCallback = args[2];
            }
            var aTransfers = void 0;
            if (_this.cantransfer) {
                if (aArg && aArg.__XFER) {
                    // if want to transfer stuff aArg MUST be an object, with a key __XFER holding the keys that should be transferred
                    // __XFER is either array or object. if array it is strings of the keys that should be transferred. if object, the keys should be names of the keys to transfer and values can be anything
                    aTransfers = [];
                    var _aArg = aArg,
                        __XFER = _aArg.__XFER;
                    // __XFER must be array or object

                    if (Array.isArray(__XFER)) {
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = (0, _getIterator3.default)(__XFER), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var xferdata = _step.value;

                                aTransfers.push(xferdata);
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
                        // assume its an object
                        if (!isObject(__XFER)) throw new Error('__XFER must be Array or Object!');
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = (0, _getIterator3.default)((0, _entries2.default)(__XFER)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var _step2$value = (0, _slicedToArray3.default)(_step2.value, 2),
                                    _xferdata = _step2$value[1];

                                aTransfers.push(_xferdata);
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
                }
            }

            var cbid = null;
            if (typeof aMethod === 'number') {
                // this is a response to a callack waiting in framescript
                cbid = aMethod;
                aMethod = null;
            } else {
                if (aCallback) {
                    cbid = _this.nextcbid++;
                    _this.receptacle[cbid] = aCallback;
                }
            }

            var payload = {
                method: aMethod,
                arg: aArg,
                cbid: cbid
            };

            _this.doSendMessageMethod(aTransfers, payload, aClientId);
        };

        this.controller = function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                var payload, mdotpath, rez_scope, val;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                payload = _this.getControllerPayload.apply(_this, args);
                                // console.log(`Comm.${this.commname} - incoming, payload:`, payload)

                                if (!payload.method) {
                                    _context.next = 24;
                                    break;
                                }

                                if (!(payload.method === '__HANDSHAKE__')) {
                                    _context.next = 5;
                                    break;
                                }

                                if (_this.onHandshake) _this.onHandshake();
                                return _context.abrupt('return');

                            case 5:

                                // let methodref =  deepAccessUsingString(this.scope, payload.method);
                                mdotpath = payload.method.split('.'); // method_dotpath

                                if (deepAccessUsingString(_this.scope, payload.method)) {
                                    _context.next = 8;
                                    break;
                                }

                                throw new Error('Comm.' + _this.commname + ' method of "' + payload.method + '" not in scope');

                            case 8:
                                rez_scope = void 0;
                                _context.t0 = mdotpath.length;
                                _context.next = _context.t0 === 1 ? 12 : _context.t0 === 2 ? 14 : 16;
                                break;

                            case 12:
                                rez_scope = _this.scope[payload.method](payload.arg, payload.cbid ? _this.getControllerReportProgress.apply(_this, [payload].concat(args)) : undefined, _this);
                                return _context.abrupt('break', 17);

                            case 14:
                                rez_scope = _this.scope[mdotpath[0]][mdotpath[1]](payload.arg, payload.cbid ? _this.getControllerReportProgress.apply(_this, [payload].concat(args)) : undefined, _this);
                                return _context.abrupt('break', 17);

                            case 16:
                                throw new Error('mdotpath length of "' + mdotpath.length + '" not supported, manually add it here');

                            case 17:
                                if (!payload.cbid) {
                                    _context.next = 22;
                                    break;
                                }

                                _context.next = 20;
                                return _promise2.default.resolve(rez_scope);

                            case 20:
                                val = _context.sent;

                                _this.sendMessage.apply(_this, (0, _toConsumableArray3.default)(_this.getControllerSendMessageArgs.apply(_this, [val, payload].concat(args))));

                            case 22:
                                _context.next = 25;
                                break;

                            case 24:
                                if (!payload.method && payload.cbid) {
                                    // its a cbid
                                    _this.receptacle[payload.cbid](payload.arg, _this);
                                    if (payload.arg && !payload.arg.__PROGRESS) {
                                        delete _this.receptacle[payload.cbid];
                                    }
                                }

                            case 25:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this);
            }));

            return function () {
                return _ref.apply(this, arguments);
            };
        }();

        // aTarget - is like window or worker or frame etc - the thing we postMessage on
        // aMethods - object of methods
        this.target = aTarget;
        this.scope = aMethods;
        if (onHandshake) {
            this.onHandshake = function () {
                _this.onHandshake = null;
                onHandshake();
            };
        }
    }
    // config - extenders should touch these, otherwise they default to what is here

    // private - set by constructor - i do modify constructor lots of times, so this may be of interest


    (0, _createClass3.default)(Base, [{
        key: 'getControllerPayload',
        value: function getControllerPayload(message) {
            // ...args
            // if webext-ports args are message, port, sendResponse
            // if frame then args are are e - so `return e.data`
            var payload = message;
            return payload;
        }
    }, {
        key: 'getControllerReportProgress',
        value: function getControllerReportProgress(payload) {
            // payload, ..args
            var cbid = payload.cbid;

            return this.reportProgress.bind({ THIS: this, cbid: cbid });
        }
        // related two methods

    }, {
        key: 'doSendMessageMethod',
        value: function doSendMessageMethod(aTransfers, payload) {
            // aTransfers, payload, aClientId
            // crossfile-link183848 - IMPORTAANT: the third arg is what defines what aClientId should be. so it defines "argument signature" of sendMessage. And getControllSendMessageArgs should return an array that matches this signature link6775492!!!
            // this.cantransfer is just a helper so that if message method is postMessage, then dever can just set that rather then override doSendMessageMethod
            if (this.cantransfer && aTransfers) {
                this.target.postMessage(payload, aTransfers);
            } else {
                // console.log(`Comm.${this.commname} - in doSendMessageMethod, payload:`, payload, 'target:', this.target);
                this.target.postMessage(payload);
            }
        }
        // getControllerSendMessageArgs is dicated by doSendMessageMethod

    }, {
        key: 'getControllerSendMessageArgs',
        value: function getControllerSendMessageArgs(val, payload) {
            // val, payload, ...args
            // ...args is the args that come to controller
            // must retrun array of arguments that this.sendMessage expects. what it expects is based on this.multiclient
            // val is message to send - aArg
            // aMethod = cbid
            var cbid = payload.cbid;

            return [cbid, val];
        }
        // reportProgress should this.sendMessage with degined/expected/signatured-above ...restargs

    }, {
        key: 'reportProgress',
        value: function reportProgress(aProgressArg) {
            // always gets manually .bind'ed
            // NOTE: aProgressArg must be an object! so dever using this must know that to report progress they must pass an object!
            var THIS = this.THIS,
                cbid = this.cbid;

            aProgressArg.__PROGRESS = 1;
            THIS.sendMessage(cbid, aProgressArg);
        }
        // end related two methods

    }, {
        key: 'unregister',
        value: function unregister() {
            // console.error(`Comm.${this.commname} - in unregister`);
            if (this.isunregistered) throw new Error('Comm.' + this.commname + ' - already unregistered');
            this.isunregistered = true;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(this.onUnregister.handlers), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var handler = _step3.value;
                    handler(this.target, this);
                }
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
        }
        // private - to comm - extenders dont touch this

    }]);
    return Base;
}();

function callInTemplate(aCommTo, aCallInMethod, aMessageManagerOrTabId, aMethod, aArg, aCallback) {
    // MUST not be used directly, MUSt have aCommTo and aCallInMethod bounded
    // aCommTo - is either the Comm instance, or a function that on exec gets the Comm instance
    aCommTo = typeof aCommTo === 'function' ? aCommTo() : aCommTo;
    var _aCommTo = aCommTo,
        sendMessage = _aCommTo.sendMessage;

    if (aMessageManagerOrTabId) sendMessage = sendMessage.bind(aCommTo, aMessageManagerOrTabId);

    if (isObject(aMethod)) {
        var aReportProgress = aArg;
        // var aCommFrom = aCallback; // i dont use it, but it is correct
        var _aMethod = aMethod;
        aMethod = _aMethod.m;
        aArg = _aMethod.a;

        if (!aCallInMethod) {
            if (aReportProgress) {
                // if it has aReportProgress then the scope has a callback waiting for reply
                return new _promise2.default(function (resolve) {
                    sendMessage(aMethod, aArg, function (rez) {
                        if (rez && rez.__PROGRESS) {
                            aReportProgress(rez);
                        } else {
                            resolve(rez);
                        }
                    });
                });
            } else {
                sendMessage(aMethod, aArg);
            }
        } else {
            if (aReportProgress) {
                // if it has aReportProgress then the scope has a callback waiting for reply
                return new _promise2.default(function (resolve) {
                    sendMessage(aCallInMethod, { m: aMethod, a: aArg }, function (rez) {
                        if (rez && rez.__PROGRESS) {
                            aReportProgress(rez);
                        } else {
                            resolve(rez);
                        }
                    });
                });
            } else {
                sendMessage(aCallInMethod, { m: aMethod, a: aArg });
            }
        }
    } else {
        if (!aCallInMethod) {
            sendMessage(aMethod, aArg, aCallback);
        } else {
            sendMessage(aCallInMethod, { m: aMethod, a: aArg }, aCallback);
        }
    }
}

function isObject(avar) {
    // cosntructor.name tested for `function Animal(){}; var a = new Animal(); isObject(a);` will return true otherwise as it is [Object object]
    return Object.prototype.toString.call(avar) === '[object Object]' && avar.constructor.name === 'Object';
}

exports.default = Base;