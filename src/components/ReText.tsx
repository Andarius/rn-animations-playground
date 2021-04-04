import React, { FC } from 'react'
import {
    StyleSheet,
    TextInput,
    TextProps as RNTextProps,
    TextStyle
} from 'react-native'
import Animated, {
    useAnimatedProps,
    useDerivedValue
} from 'react-native-reanimated'

const styles = StyleSheet.create({
    baseStyle: {
        color: 'black'
    }
})
Animated.addWhitelistedNativeProps({ text: true })
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

type Props = {
    text: Animated.SharedValue<string | number>
    //@ts-expect-error
    style?: Animated.AnimateProps<TextStyle, RNTextProps>['style']
    fmtWorklet?: (x: number | string) => string
    fmtFn?: (x: number | string) => string
}

const ReText: FC<Props> = ({ fmtFn, fmtWorklet, style, text }) => {
    const _fmtalVue = useDerivedValue(() => {
        return fmtWorklet ? fmtWorklet(text.value) : text.value
    }, [fmtWorklet])

    const animatedProps = useAnimatedProps(() => {
        return {
            text: _fmtalVue.value
        }
    })
    return (
        <AnimatedTextInput
            editable={false}
            //@ts-expect-error
            value={fmtFn ? fmtFn(text.value) : text.value}
            style={[styles.baseStyle, style]}
            {...{ animatedProps }}
        />
    )
}

export { ReText }
