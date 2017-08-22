import { Platform, Dimensions } from 'react-native'

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

            const SoftBarHeight = isPortrait() ? screen.height - window.height : screen.width - window.width;
            const StatusBarHeight = StatusBar.currentHeight;

            return { status:StatusBarHeight, soft:SoftBarHeight };
        }
        // no default
    }
}