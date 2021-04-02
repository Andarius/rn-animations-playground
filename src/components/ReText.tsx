import React from 'react'
import {
    StyleSheet,
    TextInput,
    TextProps as RNTextProps,
    TextStyle
} from 'react-native'
import Animated, { useAnimatedProps } from 'react-native-reanimated'

const styles = StyleSheet.create({
    baseStyle: {
        color: 'black'
    }
})
Animated.addWhitelistedNativeProps({ text: true })

interface TextProps {
    text: Animated.SharedValue<string>
    //@ts-expect-error
    style?: Animated.AnimateProps<TextStyle, RNTextProps>['style']
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)
const ReText = (props: TextProps) => {
    const { text, style } = { style: {}, ...props }
    const animatedProps = useAnimatedProps(() => {
        return {
            text: text.value
        }
    })
    return (
        //@ts-expect-error
        <AnimatedTextInput
            editable={false}
            value={text.value}
            style={[styles.baseStyle, style]}
            {...{ animatedProps }}
        />
    )
}

export { ReText }
