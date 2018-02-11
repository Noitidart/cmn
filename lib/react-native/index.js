'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.animate = animate;
exports.getBarHeights = getBarHeights;
exports.testIsPortrait = testIsPortrait;

var _reactNative = require('react-native');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function animate(method, driver, opts) {
    // resolves to true on succesfully completion, resolves to false if canceld with stopAnimation (i havent seen any other cases for false yet)
    // either one argument of array of arrays OR three arguments of "method, driver, opts"

    var anim = void 0;
    if (Array.isArray(method)) {
        var multi = method;
        var anims = multi.map(function (_ref) {
            var _ref2 = (0, _slicedToArray3.default)(_ref, 3),
                method = _ref2[0],
                driver = _ref2[1],
                opts = _ref2[2];

            // opts.useNativeDriver = true;
            var anim = _reactNative.Animated[method](driver, opts);
            return anim;
        });
        anim = _reactNative.Animated.parallel(anims);
    } else {
        // opts.useNativeDriver = true;
        anim = _reactNative.Animated[method](driver, opts);
    }
    return new _promise2.default(function (resolve) {
        return anim.start(function (_ref3) {
            var finished = _ref3.finished;
            return resolve(finished);
        });
    });
}

function getBarHeights() {
    /* returns
    {
        status: number // SatusBar
        soft: number / SoftBar - Android only
    }
    */
    switch (_reactNative.Platform.OS) {
        case 'ios':
            return { status: 20 };
        case 'android':
            {
                var window = _reactNative.Dimensions.get('window');
                var screen = _reactNative.Dimensions.get('screen');
                // const SCALE = window.scale; // same as get screen.scale

                // console.log('window:', Dimensions.get('window'))
                // console.log('screen:', Dimensions.get('screen'))
                // console.log('StatusBarManager.HEIGHT:', NativeModules.StatusBarManager, 'StatusBar.currentHeight:', StatusBar.currentHeight)
                var SoftBarHeight = testIsPortrait() ? screen.height - window.height : screen.width - window.width;
                var StatusBarHeight = _reactNative.StatusBar.currentHeight;
                // console.log('SoftBarHeight:', SoftBarHeight);
                // console.log('StatusBarHeight:', StatusBarHeight, 'SoftBarHeight / SCALE:', SoftBarHeight / SCALE);

                return { status: StatusBarHeight, soft: SoftBarHeight };
            }
        // no default
    }
}

function testIsPortrait() {
    var _Dimensions$get = _reactNative.Dimensions.get('screen'),
        height = _Dimensions$get.height,
        width = _Dimensions$get.width;

    return height > width;
}