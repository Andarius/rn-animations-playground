import React, { FC } from 'react'
import { TextInput, TextProps, TextStyle } from 'react-native'
import Animated, { useAnimatedProps } from 'react-native-reanimated'

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
            //@ts-ignore
            value={text.value}
            style={style}
            {...{ animatedProps }}
        />
    )
}

export { ReText }
