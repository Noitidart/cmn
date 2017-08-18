'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Client = exports.HANDSHAKE = exports.SPLITTER = exports.DISCONNECT_REQUEST = exports.CONNECT_REQUEST = undefined;

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

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _electron = require('electron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONNECT_REQUEST = exports.CONNECT_REQUEST = 'CONNECT_REQUEST';
var DISCONNECT_REQUEST = exports.DISCONNECT_REQUEST = 'DISCONNECT_REQUEST';
var SPLITTER = exports.SPLITTER = '~~';
var HANDSHAKE = exports.HANDSHAKE = '__HANDSHAKE__';

var Client = exports.Client = function (_Base) {
    (0, _inherits3.default)(Client, _Base);
    (0, _createClass3.default)(Client, [{
        key: 'unregister',

        // target = undefined // set in constructor

        // use in any non-background.js
        // base config
        value: function unregister() {
            (0, _get3.default)(Client.prototype.__proto__ || (0, _getPrototypeOf2.default)(Client.prototype), 'unregister', this).call(this);
            _electron.ipcRenderer.removeListener(this.target, this.controller);
        } // suffix added in constructor

    }, {
        key: 'doSendMessageMethod',
        value: function doSendMessageMethod(aTransfers, payload) {
            // this defines what `aClientId` should be in crossfile-link183848 - so this defines what "...restargs" should be "a channel OR a channel id"
            // aClientId is aChannelOrChannelId
            // webext channels does not support transfering
            console.log('doing send from renderer, this.target:', this.target, 'payload:', payload); // this.channels[channel].send
            _electron.ipcRenderer.send(this.target, payload);
        }
    }, {
        key: 'getControllerPayload',
        value: function getControllerPayload(e, payload) {
            return payload;
        }
    }]);

    function Client(aMethods) {
        var aChannelGroupName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'general';
        var onHandshake = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        (0, _classCallCheck3.default)(this, Client);

        // aChannelGroupName is so server can broadcast a message to certain group

        var channelId = (0, _v2.default)();
        var channel = aChannelGroupName + SPLITTER + channelId;

        // sets this.target = channel

        var _this = (0, _possibleConstructorReturn3.default)(this, (Client.__proto__ || (0, _getPrototypeOf2.default)(Client)).call(this, channel, aMethods, onHandshake));

        _this.commname = 'Electron.Client';
        _this.cantransfer = false;
        _this.commname += channelId;
        _this.groupname = aChannelGroupName;

        _electron.ipcRenderer.on(channel, _this.controller);
        _electron.ipcRenderer.send(CONNECT_REQUEST, channel); // not a regular sendMessage // this.sendMessage(CONNECT_REQUEST, channel);
        return _this;
    }
    // custom config - specific to this class
    // groupname = null // set in constructor


    (0, _createClass3.default)(Client, [{
        key: 'getChannel',
        value: function getChannel() {
            return this.target;
        }
        // disconnector = aChannel => {
        //     console.log(`Comm.${this.commname} - incoming disconnect request, aChannel:`, aChannel);
        //     this.target.onDisconnect.removeListener(this.disconnector);
        //     if(!this.isunregistered) this.unregister(); // if .disconnector triggered by this.unregister being called first, this second call here on this line will fail as in base unregister can only be called once otherwise it throws
        // }

    }]);
    return Client;
}(_comm2.default);