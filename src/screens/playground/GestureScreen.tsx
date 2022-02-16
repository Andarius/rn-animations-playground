import { clamp } from '@src/animUtils'
import { Card, CARD_HEIGHT, CARD_WIDTH } from '@src/components/Card'
import { useTopBarHeight } from '@src/hooks'
import { Colors } from '@src/theme'
import React from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDecay
} from 'react-native-reanimated'

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export type Props = {}

const GestureScreen: RNNFC<Props> = function ({}) {
    const { width, height } = useWindowDimensions()
    const topBarHeight = useTopBarHeight()
    const [boundX, boundY] = [
        width - CARD_WIDTH,
        height - topBarHeight - CARD_HEIGHT
    ]
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)

    const offsetX = useSharedValue<number>(0)
    const offsetY = useSharedValue<number>(0)

    const panGesture = Gesture.Pan()
        .onBegin((_) => {
            offsetX.value = translateX.value
            offsetY.value = translateY.value
        })
        .onUpdate((event) => {
            // Clamp to avoid moving outside of the screen
            translateX.value = clamp(
                offsetX.value + event.translationX,
                0,
                boundX
            )
            translateY.value = clamp(
                offsetY.value + event.translationY,
                0,
                boundY
            )
        })
        .onEnd((event) => {
            translateX.value = withDecay({
                velocity: event.velocityX,
                clamp: [0, boundX]
            })
            translateY.value = withDecay({
                velocity: event.velocityY,
                clamp: [0, boundY]
            })
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
            <GestureDetector gesture={panGesture}>
                <Animated.View {...{ style }}>
                    <Card />
                </Animated.View>
            </GestureDetector>
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
