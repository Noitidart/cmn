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

                // console.log('window:', Dimensions.get('window'))
                // console.log('screen:', Dimensions.get('screen'))
                // console.log('StatusBarManager.HEIGHT:', NativeModules.StatusBarManager, 'StatusBar.currentHeight:', StatusBar.currentHeight)
                var SoftBarHeight = isPortrait() ? screen.height - window.height : screen.width - window.width;
                var StatusBarHeight = _reactNative.StatusBar.currentHeight;
                // console.log('SoftBarHeight:', SoftBarHeight);
                // console.log('StatusBarHeight:', StatusBarHeight, 'SoftBarHeight / SCALE:', SoftBarHeight / SCALE);

                return { status: StatusBarHeight, soft: SoftBarHeight };
            }
        // no default
    }
}