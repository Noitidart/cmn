'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Server = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _comm = require('./comm');

var _comm2 = _interopRequireDefault(_comm);

var _electron = require('electron');

var _electronClient = require('./electron-client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-unused-vars

/*
RULES
* Handshake is multi triggered
* Handshake triggers every time a channel connects. It first triggers server side, then triggers client side.
* Server onHandshake arguments - (channel) so can do in onHandshake, callIn(channel, ...)
* Client onHandshake arguments - nothing
* Earliest time can do callIn
  * Server - after channel connection is made, so onHandshake
  * Client - soon after new Client() - this will trigger before onHandshake obviously
* Can do new ChannelsServer right away in background.js
* Can do new ChannelsClient right away in client
* ChannelsServer should only be done from backgrond.js - i didnt think of the implications of not doing it in background.js
* Individually disconnecting channels
  * Server side - DO NOT do gChannelsComm.channels[blah].disconnect() - it will not trigger the disconnector. So i currently only support disconnecting all channels with gChannelsComm.unregister()
  * Client side - DO NOT do gBgComm.target.disconnect(), instead to gBgComm.unregister() - because the disconnector on client side needs to trigger, same situation on other end - but client side disconnector doesnt really do anything important
* Microsoft Edge - when tab is closed, it is not triggering disconnector! weird howevering doing gBgComm.target.disconnect() from tab is working!
*/

var Server = exports.Server = function (_Base) {
    (0, _inherits3.default)(Server, _Base);
    (0, _createClass3.default)(Server, [{
        key: 'doSendMessageMethod',
        value: function doSendMessageMethod(aTransfers, payload, channel) {
            // this defines what `aClientId` should be in crossfile-link183848 - so this defines what "...restargs" should be "a channel OR a channel id"
            // aClientId is aChannelOrChannelId
            // webext channels does not support transfering
            console.log('doing send on channel:', channel, 'payload:', payload); // this.channels[channel].send
            this.channels[channel].send(channel, payload);
        }
        // use from backgrond.js
        // base config

    }, {
        key: 'getControllerPayload',
        value: function getControllerPayload(e, payload) {
            return payload;
        }
    }, {
        key: 'getControllerSendMessageArgs',
        value: function getControllerSendMessageArgs(val, payload, e) {
            // , ...args
            var cbid = payload.cbid;
            // console.log('getControllerSendMessageArgs ::', 'val:', val, 'payload:', payload, 'e:', e, 'args:', args);

            var channel = this.getChannelFromWebContent(e.sender);
            return [channel, cbid, val];
        }
    }, {
        key: 'getControllerReportProgress',
        value: function getControllerReportProgress(payload, e /*, payload*/) {
            // console.log('getControllerReportProgress ::', 'payload:', payload, 'args:', args);
            var cbid = payload.cbid;

            var channel = this.getChannelFromWebContent(e.sender);
            return this.reportProgress.bind({ THIS: this, cbid: cbid, channel: channel });
        }
    }, {
        key: 'reportProgress',
        value: function reportProgress(aProgressArg) {
            var THIS = this.THIS,
                cbid = this.cbid,
                channel = this.channel;

            aProgressArg.__PROGRESS = 1;
            THIS.sendMessage(channel, cbid, aProgressArg);
        }
    }, {
        key: 'unregister',
        value: function unregister() {
            (0, _get3.default)(Server.prototype.__proto__ || (0, _getPrototypeOf2.default)(Server.prototype), 'unregister', this).call(this);

            extension.runtime.onConnect.removeListener(this.connector);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(this.channels)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var channel = _step.value;

                    this.disconnector({}, channel);
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
        }
    }]);

    function Server(aMethods, onHandshake) {
        (0, _classCallCheck3.default)(this, Server);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Server.__proto__ || (0, _getPrototypeOf2.default)(Server)).call(this, null, aMethods, onHandshake));

        _this.commname = 'Electron.Server';
        _this.cantransfer = false;
        _this.multiclient = true;
        _this.channels = {};

        _this.connector = function (e, channel) {
            console.log('Comm.' + _this.commname + ' - incoming connect request, channel:', channel);
            _this.channels[channel] = e.sender;
            _electron.ipcMain.on(channel, _this.controller);
            _this.sendMessage(channel, _electronClient.HANDSHAKE); // do this before triggering onHandshake on serverside, because in server side handshake their might be some callInChannel(channel, ...) and we wand handshake to trigger on client side before these callInChannel calls
            if (_this.onHandshake) _this.onHandshake(channel);
        };

        _this.disconnector = function (e, channel) {
            console.log('Comm.' + _this.commname + ' - incoming disconnect request, static channel:', channel, 'e:', e);
            _electron.ipcMain.removeListener(channel, _this.controller);
            delete _this.channels[channel];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(_this.onDisconnect.handlers), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var handler = _step2.value;
                    handler(channel, _this);
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
        };

        _this.onDisconnect = { // onChannelDisconnect
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


        if (onHandshake) _this.onHandshake = onHandshake; // because can fire multiple times i override what the super does

        _electron.ipcMain.on(_electronClient.CONNECT_REQUEST, _this.connector);
        return _this;
    }
    // custom config - specific to this class


    (0, _createClass3.default)(Server, [{
        key: 'broadcastMessage',
        // key is channel, value is channel
        value: function broadcastMessage(groupName, method, arg, callback) {
            // callback triggers for each channel
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)((0, _keys2.default)(this.channels)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var channel = _step3.value;

                    if (channel.startsWith(groupName + _electronClient.SPLITTER)) {
                        this.sendMessage(channel, method, arg, callback);
                    }
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
    }, {
        key: 'getChannelFromWebContent',
        value: function getChannelFromWebContent(webContent) {
            var entry = (0, _entries2.default)(this.channels).find(function (_ref) {
                var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
                    aWebContent = _ref2[1];

                return aWebContent === webContent;
            });
            if (!entry) {
                console.error('could not find channel for e.sender! this should never happen');
                throw new Error('could not find channel for e.sender! this should never happen');
            }

            var _entry = (0, _slicedToArray3.default)(entry, 1),
                channel = _entry[0];

            return channel;
        }
    }, {
        key: 'getChannel',
        value: function getChannel(channel) {
            return this.channels[channel];
        }
    }, {
        key: 'getChannelId',
        value: function getChannelId(channel) {
            if (channel in this.channels) return channel;else throw new Error('Channel by name of "' + channel + '" not found!');
        }
    }]);
    return Server;
}(_comm2.default);