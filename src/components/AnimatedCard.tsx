import { Colors } from '@src/theme'
import React, { FC } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

export const CARD_WIDTH = 330
export const CARD_HEIGHT = 170

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 20,
        backgroundColor: Colors.primary
    }
})

export type Props = {
    style?: StyleProp<ViewStyle>,
    height: Animated.SharedValue<number>
 }

const AnimatedCard: FC<Props> = function ({ children, style, height }) {

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value
    }))

    return (
        <Animated.View style={[styles.container, style, animatedStyle]}>
            { children }
        </Animated.View>
    )
}

export { AnimatedCard }
