import React, { FC } from 'react'
import { View, StyleSheet, TextInput, TextStyle, TextProps } from 'react-native'
import Animated, { useAnimatedProps } from 'react-native-reanimated'


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

export type Props = {
    text: Animated.SharedValue<string | number>
    style?: Animated.AnimateProps<TextStyle, TextProps>['style']
}

const ReText: FC<Props> = function ({ text, style }) {

    const animatedProps = useAnimatedProps(() => {
        return {
            text: text.value
        }
    })

    return (
        <AnimatedTextInput
            underlineColorAndroid="transparent"
            editable={false}
            value={text.value}
            style={style}
            {...{ animatedProps }}
        />
    )
}

export { ReText }
