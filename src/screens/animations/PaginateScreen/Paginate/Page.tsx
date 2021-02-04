import React, { FC } from 'react'
import { StyleSheet } from 'react-native'
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent
} from 'react-native-gesture-handler'
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useDerivedValue,
    withSpring
} from 'react-native-reanimated'

export type Direction = 'left' | 'right'

function stiffnessFromTension(oValue: number) {
    return (oValue - 30) * 3.62 + 194
}

function dampingFromFriction(oValue: number) {
    return (oValue - 8) * 3 + 25
}
const SPRING_CONFIG: Animated.WithSpringConfig = {
    stiffness: stiffnessFromTension(400),
    damping: dampingFromFriction(50),
    mass: 5,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01
}

function updateOffsets(
    offsets: Offset[],
    direction: Direction,
    initOffsets: number[]
) {
    'worklet'

    offsets.map((offset) => {
        if (direction === 'right')
            offset.position.value =
                offset.position.value === 1
                    ? 2
                    : offset.position.value === 2
                    ? 0
                    : 1
        else
            offset.position.value =
                offset.position.value === 1
                    ? 0
                    : offset.position.value === 2
                    ? 1
                    : 2
        offset.x.value = initOffsets[offset.position.value] // offset.position.value * width//
        offset.translateX.value = 0
    })
}

export type Offset = {
    x: Animated.SharedValue<number>
    translateX: Animated.SharedValue<number>
    position: Animated.SharedValue<number>
}

export type Props = {
    offset: Offset
    offsets: Offset[]
    width: Animated.SharedValue<number>
    height: Animated.SharedValue<number>
    onDoneMoving?: (direction: Direction) => void
    initPositions: number[]
}

const Page: FC<Props> = function ({
    offset,
    width,
    height,
    children,
    offsets,
    onDoneMoving,
    initPositions
}) {
    const { x, translateX } = offset

    const _translateX = useDerivedValue(() => x.value + translateX.value)

    const style = useAnimatedStyle(() => ({
        transform: [{ translateX: _translateX.value }],
        width: width.value,
        height: height.value
    }))

    const onGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        { isMoving: boolean }
    >({
        onStart: () => {},
        onActive: (event) => {
            offsets.map((_x) => (_x.translateX.value = event.translationX))
        },
        onEnd: (event) => {
            const velocityThresh = Math.abs(event.velocityX) > 100
            const swipeThresh = width.value / 2 < Math.abs(event.translationX)
            const shouldSwap = velocityThresh || swipeThresh

            const config = SPRING_CONFIG
            config.velocity = event.velocityX

            const moveRight = event.translationX > 0

            if (!shouldSwap) {
                offsets.map((_x) => (_x.translateX.value = withSpring(0, config)))
            } else {
                if (moveRight)
                    offsets.map(
                        (_x, i) =>
                            (_x.translateX.value = withSpring(
                                width.value,
                                config,
                                () => {
                                    if (i !== 0) return
                                    updateOffsets(
                                        offsets,
                                        'right',
                                        initPositions
                                    )
                                    if (onDoneMoving)
                                        runOnJS(onDoneMoving)('right')
                                }
                            ))
                    )
                else
                    offsets.map(
                        (_x, i) =>
                            (_x.translateX.value = withSpring(
                                -width.value,
                                config,
                                () => {
                                    if (i !== 0) return
                                    updateOffsets(
                                        offsets,
                                        'left',
                                        initPositions
                                    )
                                    if (onDoneMoving)
                                        runOnJS(onDoneMoving)('left')
                                }
                            ))
                    )
            }
        }
    })

    return (
        <PanGestureHandler activeOffsetY={[-1, 1]} {...{ onGestureEvent }}>
            <Animated.View
                style={[{ ...StyleSheet.absoluteFillObject }, style]}>
                {children}
            </Animated.View>
        </PanGestureHandler>
    )
}

export { Page }
