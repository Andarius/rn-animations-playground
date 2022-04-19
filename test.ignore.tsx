import React from 'react'
import { RectButton } from 'react-native-gesture-handler'
import Animated, {
    useAnimatedProps,
    useSharedValue
} from 'react-native-reanimated'

const AnimatedButton = Animated.createAnimatedComponent(RectButton)

const Test = function () {
    const enabled = useSharedValue<boolean>(true)

    const animatedProps = useAnimatedProps(() => {
        return {
            enabled: enabled.value
        }
    }, [])

    const onPress = () => {
        console.log('Pressed')
    }

    return (
        <AnimatedButton
            style={{
                width: 100,
                height: 50,
                backgroundColor: 'red'
            }}
            animatedProps={animatedProps}
            onPress={onPress}
        />
    )
}

export { Test }
