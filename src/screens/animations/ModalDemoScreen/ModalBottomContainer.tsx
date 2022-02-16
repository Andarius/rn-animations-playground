import { InsetUtils } from '@src/insets'
import { Colors } from '@src/theme'
import React, { FC, useEffect } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet
} from 'react-native'
import { BaseButton } from 'react-native-gesture-handler'
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    WithTimingConfig
} from 'react-native-reanimated'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    box: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        backgroundColor: Colors.white,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const CONFIG: WithTimingConfig = {
    duration: 200,
    easing: Easing.inOut(Easing.cubic)
}

export type Props = {
    height: number
    onDone: () => void
    onDisplayed?: () => void
}

const BOTTOM_INSET = InsetUtils.getInsets().bottom
const PADDING_BOTTOM = BOTTOM_INSET === 0 ? 20 : 0

const ModalBottomContainer: FC<Props> = function ({
    height,
    onDone,
    onDisplayed,
    children
}) {
    const translateY = useSharedValue(height)
    const correctedHeight = height + BOTTOM_INSET

    const onPressBackground = () => {
        'worklet'
        translateY.value = correctedHeight
    }

    const onDoneAnimating = (finished?: boolean) => {
        'worklet'
        if (!finished) return
        if (translateY.value === -PADDING_BOTTOM && onDisplayed)
            runOnJS(onDisplayed)()
        if (translateY.value === correctedHeight) {
            runOnJS(onDone)()
        }
    }

    const style = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: withTiming(
                    translateY.value,
                    CONFIG,
                    onDoneAnimating
                )
            }
        ]
    }))

    useEffect(() => {
        translateY.value = -PADDING_BOTTOM
    }, [translateY])

    return (
        <KeyboardAvoidingView
            enabled={Platform.OS === 'ios'}
            behavior="padding"
            style={styles.container}
            contentContainerStyle={styles.container}
            keyboardVerticalOffset={10}>
            <SafeAreaView style={styles.container}>
                <BaseButton
                    rippleColor="transparent"
                    style={styles.container}
                    onPress={onPressBackground}>
                    <Animated.View style={[styles.box, { height }, style]}>
                        {children}
                    </Animated.View>
                </BaseButton>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export { ModalBottomContainer }
