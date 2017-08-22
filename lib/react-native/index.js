'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isPortrait = isPortrait;
exports.getBarHeights = getBarHeights;

var _reactNative = require('react-native');

function isPortrait() {
    var _Dimensions$get = _reactNative.Dimensions.get('screen'),
        height = _Dimensions$get.height,
        width = _Dimensions$get.width;

    return height > width;
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

                var SoftBarHeight = isPortrait() ? screen.height - window.height : screen.width - window.width;
                var StatusBarHeight = StatusBar.currentHeight;

                return { status: StatusBarHeight, soft: SoftBarHeight };
            }
        // no default
    }
}