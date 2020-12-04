import React, { FC, useEffect } from 'react'
import {
    Navigation,
    NavigationFunctionComponent as RNNFC
} from 'react-native-navigation'
import { View, StyleSheet, Image, Text } from 'react-native'
import { Colors } from '@src/theme'
import { BaseButton, RectButton } from 'react-native-gesture-handler'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

export const BTN_HEIGHT = 50
export const ICON_SIZE = 22
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    menu: {
        minWidth: 200,
        backgroundColor: Colors.white,
        borderRadius: 10,
        position: 'absolute',
        top: 5,
        right: 15,
        elevation: 2,
        overflow: 'hidden'
    },
    btn: {
        flexDirection: 'row',
        height: BTN_HEIGHT,
        alignItems: 'center',
        justifyContent: 'flex-start'
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
}

export type Props = {
    btns: Btn[]
}

const Menu: RNNFC<Props> = function ({ componentId, btns }) {
    function onDismiss() {
        Navigation.dismissOverlay(componentId)
    }

    const height = useSharedValue<number>(0)

    const opacity = useSharedValue<number>(1)

    useEffect(() => {
        height.value = withTiming(btns.length * BTN_HEIGHT, {
            duration: 300,
            easing: Easing.inOut(Easing.cubic)
        })
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
        opacity: opacity.value
    }))


    return (
        <BaseButton
            rippleColor="transparent"
            style={styles.container}
            onPress={onDismiss}>
            <Animated.View style={[styles.menu, animatedStyle]}>
                {btns.map(({ icon, text, onPress }, i) => (
                    <RectButton
                        onPress={() => {
                            onPress()
                            onDismiss()
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

Menu.options = {
    layout: {
        componentBackgroundColor: 'transparent'
    },
    overlay: {
        interceptTouchOutside: false
    }
}

export { Menu }
