'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Client = exports.Server = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
RULES
* Handshake is multi triggered
* Handshake triggers every time a port connects. It first triggers server side, then triggers client side.
* Server onHandshake arguments - (port) so can do in onHandshake, callIn(port, ...)
* Client onHandshake arguments - nothing
* Earliest time can do callIn
  * Server - after port connection is made, so onHandshake
  * Client - soon after new Client() - this will trigger before onHandshake obviously
* Can do new PortsServer right away in background.js
* Can do new PortsClient right away in client
* PortsServer should only be done from backgrond.js - i didnt think of the implications of not doing it in background.js
* Individually disconnecting ports
  * Server side - DO NOT do gPortsComm.ports[blah].disconnect() - it will not trigger the disconnector. So i currently only support disconnecting all ports with gPortsComm.unregister()
  * Client side - DO NOT do gBgComm.target.disconnect(), instead to gBgComm.unregister() - because the disconnector on client side needs to trigger, same situation on other end - but client side disconnector doesnt really do anything important
* Microsoft Edge - when tab is closed, it is not triggering disconnector! weird howevering doing gBgComm.target.disconnect() from tab is working!
*/

var Server = exports.Server = function (_Base) {
    (0, _inherits3.default)(Server, _Base);
    (0, _createClass3.default)(Server, [{
        key: 'doSendMessageMethod',
        value: function doSendMessageMethod(aTransfers, payload, aPortOrPortId) {
            // this defines what `aClientId` should be in crossfile-link183848 - so this defines what "...restargs" should be "a port OR a port id"
            // aClientId is aPortOrPortId
            // webext ports does not support transfering
            var port = (typeof aPortOrPortId === 'undefined' ? 'undefined' : (0, _typeof3.default)(aPortOrPortId)) === 'object' ? aPortOrPortId : this.ports[aPortOrPortId];
            port.postMessage(payload);
        }
        // use from backgrond.js
        // base config

    }, {
        key: 'getControllerSendMessageArgs',
        value: function getControllerSendMessageArgs(val, payload, message, port /*, sendResponse*/) {
            var cbid = payload.cbid;

            return [port, cbid, val];
        }
    }, {
        key: 'getControllerReportProgress',
        value: function getControllerReportProgress(payload, message, port /*, sendResponse*/) {
            var cbid = payload.cbid;

            return this.reportProgress.bind({ THIS: this, cbid: cbid, port: port });
        }
    }, {
        key: 'reportProgress',
        value: function reportProgress(aProgressArg) {
            var THIS = this.THIS,
                cbid = this.cbid,
                port = this.port;

            aProgressArg.__PROGRESS = 1;
            THIS.sendMessage(port, cbid, aProgressArg);
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
                for (var _iterator = (0, _getIterator3.default)((0, _entries2.default)(this.ports)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
                        port = _step$value[1];

                    port.disconnect();
                    this.disconnector(port, true);
                    // port.disconnect();
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

        _this.commname = 'WebextPorts.Server';
        _this.cantransfer = false;
        _this.multiclient = true;
        _this.ports = {};
        _this.nextportid = 1;

        _this.connector = function (aPort) {
            // console.log(`Comm.${this.commname} - incoming connect request, aPortGroupName:`, aPort.name, 'aPort:', aPort);
            var groupname = aPort.name;
            var portid = groupname + Server.portid_groupname_splitter + _this.nextportid++;
            _this.ports[portid] = aPort;
            aPort.onMessage.addListener(_this.controller);
            aPort.onDisconnect.addListener(_this.disconnector);
            _this.sendMessage(portid, '__HANDSHAKE__');
            if (_this.onHandshake) _this.onHandshake(aPort);
        };

        _this.disconnector = function (aPort) {
            // console.log(`Comm.${this.commname} - incoming disconnect request, static aPort:`, aPort, 'portid:', this.getPortId(aPort));
            var portid = _this.getPortId(aPort);
            aPort.onMessage.removeListener(_this.controller); // probably not needed, as it was disconnected
            delete _this.ports[portid];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(_this.onDisconnect.handlers), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var handler = _step2.value;
                    handler(aPort, portid, _this);
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

        _this.onDisconnect = { // onPortDisconnect
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

        extension.runtime.onConnect.addListener(_this.connector);
        return _this;
    }
    // custom config - specific to this class
    // key is portid


    (0, _createClass3.default)(Server, [{
        key: 'broadcastMessage',
        value: function broadcastMessage(aPortGroupName, aMethod, aArg, aCallback) {
            // aCallback triggers for each port
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)((0, _entries2.default)(this.ports)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _step3$value = (0, _slicedToArray3.default)(_step3.value, 2),
                        portid = _step3$value[0],
                        port = _step3$value[1];

                    if (portid.startsWith(aPortGroupName + Server.portid_groupname_splitter)) {
                        this.sendMessage(port, aMethod, aArg, aCallback);
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
        key: 'getPort',
        value: function getPort(aPortId) {
            return this.ports[aPortId];
        }
    }, {
        key: 'getPortId',
        value: function getPortId(aPort) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = (0, _getIterator3.default)((0, _entries2.default)(this.ports)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _step4$value = (0, _slicedToArray3.default)(_step4.value, 2),
                        portid = _step4$value[0],
                        port = _step4$value[1];

                    if (port === aPort) return portid;
                }
                // console.error('portid for aPort not found!', 'aPort:', aPort, 'this.ports:', this.ports);
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

            throw new Error('portid for aPort not found!');
        }
    }]);
    return Server;
}(_comm2.default); /* global extension:false */

Server.portid_groupname_splitter = '~~';

var Client = exports.Client = function (_Base2) {
    (0, _inherits3.default)(Client, _Base2);
    (0, _createClass3.default)(Client, [{
        key: 'unregister',

        // target = port // set in constructore

        // use in any non-background.js
        // base config
        value: function unregister() {
            (0, _get3.default)(Client.prototype.__proto__ || (0, _getPrototypeOf2.default)(Client.prototype), 'unregister', this).call(this);
            this.target.onMessage.removeListener(this.listener); // i probably dont need this as I do `port.disconnect` on next line
            this.disconnector(this.target);
            this.target.disconnect();
        } // suffix added in constructor

    }]);

    function Client(aMethods) {
        var aPortGroupName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'general';
        var onHandshake = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        (0, _classCallCheck3.default)(this, Client);

        // aPortGroupName is so server can broadcast a message to certain group

        var port = extension.runtime.connect({ name: aPortGroupName });

        // sets this.target = port

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (Client.__proto__ || (0, _getPrototypeOf2.default)(Client)).call(this, port, aMethods, onHandshake));

        _this2.commname = 'WebextPorts.Client.';
        _this2.cantransfer = false;

        _this2.disconnector = function (aPort) {
            // console.log(`Comm.${this.commname} - incoming disconnect request, aPort:`, aPort);
            _this2.target.onDisconnect.removeListener(_this2.disconnector);
            if (!_this2.isunregistered) _this2.unregister(); // if .disconnector triggered by this.unregister being called first, this second call here on this line will fail as in base unregister can only be called once otherwise it throws
        };

        _this2.commname += Math.random();
        _this2.groupname = aPortGroupName;

        _this2.target.onMessage.addListener(_this2.controller);
        _this2.target.onDisconnect.addListener(_this2.disconnector);
        return _this2;
    }
    // custom config - specific to this class
    // groupname = null // set in constructor


    (0, _createClass3.default)(Client, [{
        key: 'getPort',
        value: function getPort() {
            return this.target;
        }
    }]);
    return Client;
}(_comm2.default);