'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.default = fetch;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var awaitable = function () {
    function awaitable(xhr) {
        (0, _classCallCheck3.default)(this, awaitable);

        this.xhr = xhr;
    }

    (0, _createClass3.default)(awaitable, [{
        key: 'json',
        value: function json() {
            var _this = this;

            return new _promise2.default(function (resolve) {
                return resolve(JSON.parse(_this.xhr.responseText));
            });
        }
    }, {
        key: 'text',
        value: function text() {
            var _this2 = this;

            return new _promise2.default(function (resolve) {
                return resolve(_this2.xhr.responseText);
            });
        }
    }]);
    return awaitable;
}();

function fetch(url) {
    return new _promise2.default(function (resolve, reject) {
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