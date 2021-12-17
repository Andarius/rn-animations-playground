import { Colors } from '@src/theme'
import React, { useEffect } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { BaseButton, RectButton } from 'react-native-gesture-handler'
import {
    Navigation,
    NavigationFunctionComponent as RNNFC
} from 'react-native-navigation'
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'

export const BTN_HEIGHT = 50
export const ICON_SIZE = 22

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    menu: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        position: 'absolute',
        top: 5,
        right: 15,
        elevation: 2,
        overflow: 'hidden'
        // paddingHorizontal: 20
    },
    btn: {
        flexDirection: 'row',
        height: BTN_HEIGHT,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 10
    },
    iconContainer: {
        width: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        tintColor: Colors.primary
    },
    text: {
        fontSize: 16,
        color: Colors.primary
    }
})

type Btn = {
    onPress: () => void
    icon: number
    text: string
    testID?: string
}

export type Props = {
    btns: Btn[]
    width?: number
}

const ShowMore: RNNFC<Props> = function ({ componentId, btns, width = 100 }) {
    const height = useSharedValue<number>(0)
    const opacity = useSharedValue<number>(1)

    useEffect(() => {
        height.value = btns.length * BTN_HEIGHT
    }, [btns, height])

    const animatedStyle = useAnimatedStyle(() => ({
        height: withTiming(height.value, {
            duration: 200,
            easing: Easing.inOut(Easing.cubic)
        }),
        opacity: opacity.value
    }))

    async function _onDismiss() {
        await Navigation.dismissOverlay(componentId)
    }

    return (
        <BaseButton
            rippleColor="transparent"
            style={styles.container}
            onPress={_onDismiss}>
            <Animated.View
                style={[styles.menu, { minWidth: width }, animatedStyle]}>
                {btns.map(({ icon, text, onPress, testID }, i) => (
                    <RectButton
                        testID={testID}
                        onPress={() => {
                            onPress()
                            _onDismiss()
                        }}
                        key={i}
                        style={styles.btn}>
                        <View style={styles.iconContainer}>
                            <Image style={styles.icon} source={icon} />
                        </View>
                        <Text style={styles.text}>{text}</Text>
                    </RectButton>
                ))}
            </Animated.View>
        </BaseButton>
    )
}

ShowMore.options = {
    layout: {
        componentBackgroundColor: 'transparent'
    },
    overlay: {
        interceptTouchOutside: false
    }
}

export { ShowMore }
