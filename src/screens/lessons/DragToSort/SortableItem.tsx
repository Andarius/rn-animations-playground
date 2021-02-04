import React, { FC } from 'react'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring
} from 'react-native-reanimated'

export type Offset = {
    y: Animated.SharedValue<number>
}



export type Props = {
    index: number
    offsets: Offset[]
    item: { width: number; height: number }
}

const SortableItem: FC<Props> = function ({
    children,
    index,
    offsets,
    item: { width, height }
}) {
    const offset = offsets[index]

    const gestureActive = useSharedValue(false)
    const gestureFinishing = useSharedValue(false)

    const x = useSharedValue(0)
    const y = useSharedValue(offset.y.value)
    const safeOffsetY = useSharedValue(0)
    const translateX = useDerivedValue(() => x.value)
    const translateY = useDerivedValue(() => {
        if (gestureActive.value) {
            return y.value
        } else {
            return withSpring(offset.y.value)
        }
    })

    const onGestureEvent = useAnimatedGestureHandler({
        onStart: () => {
            gestureActive.value = true
            safeOffsetY.value = offset.y.value
        },
        onActive: (event) => {
            x.value = event.translationX
            y.value = safeOffsetY.value + event.translationY
            // Moving others
            const offsetY = Math.round(y.value / height) * height
            offsets.forEach((o, i) => {
                if (o.y.value === offsetY && i !== index) {
                    const tmp = o.y.value
                    o.y.value = offset.y.value
                    offset.y.value = tmp
                }
            })
            //
        },
        onEnd: (event) => {
            gestureActive.value = false
            gestureFinishing.value = true

            // Move back into position
            x.value = withSpring(0, {
                stiffness: 100,
                mass: 1,
                damping: 10,
                overshootClamping: false,
                restSpeedThreshold: 0.001,
                restDisplacementThreshold: 0.001,
                velocity: event.velocityX
            })
            y.value = withSpring(
                offset.y.value,
                {
                    stiffness: 100,
                    mass: 1,
                    damping: 10,
                    overshootClamping: false,
                    restSpeedThreshold: 0.001,
                    restDisplacementThreshold: 0.001,
                    velocity: event.velocityY
                },
                () => (gestureFinishing.value = false)
            )
        }
    })

    const style = useAnimatedStyle(() => ({
        zIndex: gestureActive.value || gestureFinishing.value ? 100 : 0,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value }
            //   { scale: withSpring(gestureActive.value ? 1.1 : 1) },
        ]
    }))

    return (
        <PanGestureHandler {...{ onGestureEvent }}>
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height,
                        width
                    },
                    style
                ]}>
                {children}
            </Animated.View>
        </PanGestureHandler>
    )
}

export { SortableItem }
