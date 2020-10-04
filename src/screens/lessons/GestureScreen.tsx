import React from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withDecay,
} from 'react-native-reanimated'

import { Card, CARD_WIDTH, CARD_HEIGHT } from '@src/components/Card'
import { Colors } from '@src/theme'
import { useTopBarHeight } from '@src/hooks'
import { clamp } from '@src/animUtils'

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

type Context = {
    offsetX: number
    offsetY: number
}

export type Props = {}

const GestureScreen: RNNFC<Props> = function ({ }) {

    const { width, height } = useWindowDimensions()
    const topBarHeight = useTopBarHeight()
    const [boundX, boundY] = [
        width - CARD_WIDTH,
        height - topBarHeight - CARD_HEIGHT
    ]
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)


    const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, Context>({
        onStart: (_, ctx) => {
            ctx.offsetX = translateX.value
            ctx.offsetY = translateY.value
        },
        onActive: (event, ctx) => {
            // Clamp to avoid moving outside of the screen
            translateX.value = clamp(ctx.offsetX + event.translationX, 0, boundX)
            translateY.value =  clamp(ctx.offsetY + event.translationY, 0, boundY)
        },
        onEnd: (event) => {
            translateX.value = withDecay({ velocity: event.velocityX, clamp: [0, boundX]})
            translateY.value = withDecay({ velocity: event.velocityY, clamp: [0, boundY]})
        }
    })

    const style = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value }
            ]
        }
    })

    return (
        <View style={styles.container}>
            <PanGestureHandler {...{ onGestureEvent }}>
                <Animated.View {...{ style }}>
                    <Card />
                </Animated.View>
            </PanGestureHandler>
        </View>
    )
}

GestureScreen.options = {
    topBar: {
        visible: true,
        title: {
            text: 'Pan Gesture Handler',
            color: Colors.secondary
        },
        backButton: {
            visible: true,
            color: Colors.secondary
        }
    }
}

export { GestureScreen }
