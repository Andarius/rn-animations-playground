import React, { FC, useEffect } from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent
} from 'react-native-gesture-handler'
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring
} from 'react-native-reanimated'

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    }
})

export type Offset = {
    x: Animated.SharedValue<number>
    translateX: Animated.SharedValue<number>
}

// Shamelessly taken from https://github.com/terrysahaidak/react-native-gallery-toolkit/blob/master/src/Pager.tsx
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

export type Props = {
    id: number
    index: number
    currentIndex: Animated.SharedValue<number>
    // offset: Offset
    prevOffset?: Offset
    nextOffset?: Offset
    height: number
    isMoving: Animated.SharedValue<boolean>
    onInit: (id: number, offset: Offset) => void
}

const GalleryItem: FC<Props> = function ({
    id,
    children,
    index,
    currentIndex,
    // offset,
    prevOffset,
    nextOffset,
    height,
    isMoving,
    onInit
}) {
    const { width } = useWindowDimensions()

    const x = useSharedValue<number>(index === 0 ? 0 : width)
    const translateX = useSharedValue<number>(0)

    const _translateX = useDerivedValue(() => x.value + translateX.value)

    useEffect(() => {
        onInit(id, { x, translateX })
    }, [id, onInit, translateX, x])

    // useAnimatedReaction(
    //     () => translateX.value,
    //     (newTranslate: number) => {
    //         if (
    //             translateX.value !== 0 &&
    //             Math.abs(Math.round(newTranslate)) === Math.round(width)
    //         ) {
    //             translateX.value = 0
    //             x.value = tmpX.value
    //             if (x.value === 0) currentIndex.value = index
    //             tmpX.value = 0
    //             isMoving.value = false
    //         }
    //     }
    // )

    const onGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        { isMoving: boolean }
    >({
        onStart: () => {},
        onActive: (event) => {
            if (
                (!prevOffset && event.translationX > 0) ||
                (!nextOffset && event.translationX < 0)
            ) {
            } else {
                translateX.value = event.translationX
                if (nextOffset) nextOffset.translateX.value = event.translationX
                if (prevOffset) prevOffset.translateX.value = event.translationX
            }
        },
        onEnd: (event, ctx) => {
            if (ctx.isMoving) {
                isMoving.value = false
                return
            }
            // Move back into position

            const velocityThresh = Math.abs(event.velocityX) > 100
            const swipeThresh = width / 2 < Math.abs(event.translationX)
            // console.log(
            //     `velocityThresh: ${velocityThresh} | swipe: ${swipeThresh}`
            // )
            const shouldSwap = velocityThresh || swipeThresh

            const config = SPRING_CONFIG
            config.velocity = event.velocityX

            const moveRight = event.translationX > 0

            if (!shouldSwap) {
                translateX.value = withSpring(0, config)
                if (nextOffset)
                    nextOffset.translateX.value = withSpring(0, config)
                if (prevOffset)
                    prevOffset.translateX.value = withSpring(0, config)
            } else {
                if (moveRight) {
                    if (!prevOffset) return
                    // console.log('moving right ==>')
                    translateX.value = withSpring(width, config, () => {
                        currentIndex.value = index - 1
                        translateX.value = 0
                        x.value = width
                    })
                    prevOffset.translateX.value = withSpring(
                        width,
                        config,
                        () => {
                            prevOffset.x.value = 0
                            prevOffset.translateX.value = 0
                        }
                    )
                } else {
                    if (!nextOffset) return
                    // console.log('moving left <==')
                    translateX.value = withSpring(-width, config, () => {
                        currentIndex.value = index + 1
                        translateX.value = 0
                        x.value = -width
                    })
                    nextOffset.translateX.value = withSpring(
                        -width,
                        config,
                        () => {
                            nextOffset.x.value = 0
                            nextOffset.translateX.value = 0
                        }
                    )
                }
            }
        }
    })

    const style = useAnimatedStyle(() => ({
        transform: [{ translateX: _translateX.value }]
    }))

    return (
        <PanGestureHandler activeOffsetY={[-1, 1]} {...{ onGestureEvent }}>
            <Animated.View style={[styles.container, { width, height }, style]}>
                {children}
            </Animated.View>
        </PanGestureHandler>
    )
}

export { GalleryItem }
