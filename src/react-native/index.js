import { Platform, Dimensions, StatusBar } from 'react-native'

export function isPortrait() {
    const { height, width } = Dimensions.get('screen');
    return height > width;
}

export function getBarHeights() {
    /* returns
    {
        status: number // SatusBar
        soft: number / SoftBar - Android only
    }
    */
    switch (Platform.OS) {
        case 'ios': return { status:20 };
        case 'android': {
            const window = Dimensions.get('window');
            const screen = Dimensions.get('screen');
            // const SCALE = window.scale; // same as get screen.scale

            // console.log('window:', Dimensions.get('window'))
            // console.log('screen:', Dimensions.get('screen'))
            // console.log('StatusBarManager.HEIGHT:', NativeModules.StatusBarManager, 'StatusBar.currentHeight:', StatusBar.currentHeight)
            const SoftBarHeight = isPortrait() ? screen.height - window.height : screen.width - window.width;
            const StatusBarHeight = StatusBar.currentHeight;
            // console.log('SoftBarHeight:', SoftBarHeight);
            // console.log('StatusBarHeight:', StatusBarHeight, 'SoftBarHeight / SCALE:', SoftBarHeight / SCALE);

            return { status:StatusBarHeight, soft:SoftBarHeight };
        }
        // no default
    }
}