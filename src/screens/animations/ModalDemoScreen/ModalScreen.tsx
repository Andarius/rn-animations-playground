import { InsetUtils } from '@src/insets'
import { Colors } from '@src/theme'
import React, { useEffect } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet
} from 'react-native'
import { BaseButton, TextInput } from 'react-native-gesture-handler'
import {
    Navigation,
    NavigationFunctionComponent as RNNFC,
    OptionsModalPresentationStyle
} from 'react-native-navigation'
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    WithTimingConfig
} from 'react-native-reanimated'

const HEIGHT = 150

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    box: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        height: HEIGHT,
        backgroundColor: Colors.white,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        fontSize: 20,
        color: Colors.primary
    }
})

const BOTTOM_INSET = InsetUtils.getInsets().bottom
const CORRECTED_HEIGHT = HEIGHT + BOTTOM_INSET
const PADDING_BOTTOM = BOTTOM_INSET === 0 ? 20 : 0

const CONFIG: WithTimingConfig = {
    duration: 200,
    easing: Easing.inOut(Easing.cubic)
}

export type Props = {}

const ModalScreen: RNNFC<Props> = function ({ componentId }) {
    const translateY = useSharedValue(HEIGHT)

    const onPressBackground = () => {
        'worklet'
        translateY.value = CORRECTED_HEIGHT
    }

    /**
     * Needed because of how runOnJS works.
     * See https://docs.swmansion.com/react-native-reanimated/docs/api/miscellaneous/runOnJS
     */
    const _dimissModal = () => {
        Navigation.dismissModal(componentId)
    }

    const onDoneAnimating = (finished?: boolean) => {
        'worklet'
        if (!finished) return
        if (translateY.value === CORRECTED_HEIGHT) {
            runOnJS(_dimissModal)()
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
                    <Animated.View style={[styles.box, style]}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter"
                        />
                    </Animated.View>
                </BaseButton>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

ModalScreen.options = {
    layout: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        componentBackgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    animations: {
        push: {
            waitForRender: false
        },
        showModal: {
            alpha: {
                from: 0,
                to: 1,
                duration: 200
            }
        },
        dismissModal: {
            alpha: {
                from: 1,
                to: 0,
                duration: 200
            }
        }
    },
    modalPresentationStyle: OptionsModalPresentationStyle.overCurrentContext
}

export { ModalScreen }
