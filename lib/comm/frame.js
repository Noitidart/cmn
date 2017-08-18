'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Client = exports.Server = undefined;

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _comm = require('./comm');

var _comm2 = _interopRequireDefault(_comm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
RULES
* Handshake triggers first client side
* onHandshake has no arguments on Server nor Client side
* Earliest time can do callIn
  * Server - soon after new Server() - the call will trigger AFTER Client.onHandshake obviously as thats where port is connected. in my tests the callIn fired BEFORE Server.onHandshake
  * Client - in onHandshake
* Soonest can do new FrameServer - must add iframe.addEventListener('load') and do it in the callback
* Can do new FrameClient right away
*/

var Server = exports.Server = function (_Base) {
    (0, _inherits3.default)(Server, _Base);

    // base config
    function Server(aTarget, aMethods, onHandshake) {
        (0, _classCallCheck3.default)(this, Server);

        // aTarget is window of frame
        // real target, is what communication is done on, and its port1
        var framewindow = aTarget;

        var _ref = new MessageChannel(),
            port2 = _ref.port2,
            port1 = _ref.port1;

        aTarget = port1;

        var _this = (0, _possibleConstructorReturn3.default)(this, (Server.__proto__ || (0, _getPrototypeOf2.default)(Server)).call(this, aTarget, aMethods, onHandshake));

        _this.cantransfer = true;
        _this.commname = 'Frame.Server';


        aTarget.onmessage = _this.controller;

        framewindow.postMessage({
            topic: '__PRIVATE_HANDSHAKE__',
            port2: port2
        }, '*', [port2]);
        return _this;
    }

    (0, _createClass3.default)(Server, [{
        key: 'getControllerPayload',
        value: function getControllerPayload(e) {
            return e.data;
        }
        // TODO: in unregister, maybe tell connected child frame to unregister?

    }]);
    return Server;
}(_comm2.default);

var Client = exports.Client = function (_Base2) {
    (0, _inherits3.default)(Client, _Base2);

    // base config
    function Client(aMethods, onHandshake) {
        (0, _classCallCheck3.default)(this, Client);

        // aTarget is null right now, it will be the received port2 in this.handshaker
        var aTarget = null;

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (Client.__proto__ || (0, _getPrototypeOf2.default)(Client)).call(this, aTarget, aMethods, onHandshake));

        _this2.cantransfer = true;
        _this2.commname = 'Frame.Client';

        _this2.handshaker = function (e) {
            var data = e.data;
            console.log('Comm.' + _this2.commname + ' - incoming window message, data:', data);
            if (data && (0, _comm.isObject)(data)) {
                switch (data.topic) {
                    case '__PRIVATE_HANDSHAKE__':
                        console.log('Comm.' + _this2.commname + ' - in handshake');
                        window.removeEventListener('message', _this2.handshaker, false);
                        _this2.target = data.port2;
                        _this2.target.onmessage = _this2.controller;
                        _this2.sendMessage('__HANDSHAKE__');
                        if (_this2.onHandshake) _this2.onHandshake();
                    // no default
                }
            }
        };

        window.addEventListener('message', _this2.handshaker, false);
        return _this2;
    }

    (0, _createClass3.default)(Client, [{
        key: 'getControllerPayload',
        value: function getControllerPayload(e) {
            return e.data;
        }
    }, {
        key: 'unregister',
        value: function unregister() {
            (0, _get3.default)(Client.prototype.__proto__ || (0, _getPrototypeOf2.default)(Client.prototype), 'unregister', this).call(this);
            window.removeEventListener('message', this.handshaker, false); // in case urnegister while it is still attached
        }
    }]);
    return Client;
}(_comm2.default);