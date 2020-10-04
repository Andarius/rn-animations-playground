import React, { FC } from 'react'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    //@ts-expect-error
    useAnimatedReaction
} from 'react-native-reanimated'
import { isOverlapping, IItem, Positions, GestureState, ItemID } from './utils'

const springConfig: Animated.WithSpringConfig = {
    mass: 1,
    stiffness: 150,
    damping: 30,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001
    // velocity: event.velocityY
}

export type Props = {
    // width: number
    id: ItemID
    item: IItem
    positions: Positions
    spacingY: number
    verticalOnly: boolean
    // offset: Animated.SharedValue<number>,
    // offsets: Animated.SharedValue<number>[]
}

const DraggableItem: FC<Props> = function ({
    children,
    id,
    positions,
    item: { height, offset },
    spacingY,
    verticalOnly
}) {
    const gestureState = useSharedValue<GestureState>('IDLE')
    const x = useSharedValue(0)
    const y = useSharedValue(0)

    const tmpOffset = useSharedValue(0)
    const prevHeight = useSharedValue(height.value)

    const translateX = useDerivedValue(() => x.value)
    const translateY = useDerivedValue(() => {
        if (gestureState.value === 'ACTIVE') return y.value + offset.value
        else return withSpring(offset.value, springConfig)
    })
    const maxY = useDerivedValue(() => translateY.value + height.value)

    const onGestureEvent = useAnimatedGestureHandler({
        onStart: () => {
            gestureState.value = 'ACTIVE'
            tmpOffset.value = offset.value
        },
        onActive: (event, ctx) => {
            // x.value = x.value + event.translationX

            x.value = verticalOnly ? 0 : event.translationX
            y.value = event.translationY

            positions.map((p, k) => {
                if (
                    k !== id &&
                    isOverlapping(
                        translateY.value,
                        maxY.value,
                        p.offset.value,
                        p.offset.value + p.height.value
                    )
                ) {
                    // Move down
                    if (tmpOffset.value < p.offset.value) {
                        p.offset.value = tmpOffset.value
                        tmpOffset.value =
                            tmpOffset.value + p.height.value + spacingY
                    } else {
                        const tmp = p.offset.value
                        p.offset.value =
                            p.offset.value + height.value + spacingY
                        tmpOffset.value = tmp
                    }
                }
            })
        },
        onEnd: (event, ctx) => {
            gestureState.value = 'IDLE'
            offset.value = tmpOffset.value // - diffHeight.value
            tmpOffset.value = 0
            // diffHeight.value = 0
            // Move back into position
            x.value = withSpring(0, {
                mass: 10,
                stiffness: 300,
                damping: 100,
                overshootClamping: false,
                restSpeedThreshold: 0.001,
                restDisplacementThreshold: 0.001
                // velocity: event.velocityX
            })
            y.value = withSpring(0, {
                mass: 10,
                stiffness: 300,
                damping: 100,
                overshootClamping: false,
                restSpeedThreshold: 0.001,
                restDisplacementThreshold: 0.001
                // velocity: event.velocityY
            })
        }
    })

    const style = useAnimatedStyle(() => ({
        zIndex: gestureState.value === 'ACTIVE' ? 100 : 0,
        height: height.value,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value }
            //   { scale: withSpring(gestureActive.value ? 1.1 : 1) },
        ]
    }))

    useAnimatedReaction(
        () => {
            return height.value
        },
        (newHeight: number) => {
            const diffHeight = newHeight - prevHeight.value
            if (diffHeight !== 0) {
                positions.map((p, k) => {
                    if (k !== id && p.offset.value > offset.value) {
                        p.offset.value = p.offset.value + diffHeight
                    }
                })
                prevHeight.value = newHeight
            }
        }
    )

    return (
        <PanGestureHandler {...{ onGestureEvent }}>
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        alignItems: 'center',
                        backgroundColor: 'blue',
                        width: '100%'
                    },
                    style
                ]}>
                {children}
            </Animated.View>
        </PanGestureHandler>
    )
}

export { DraggableItem }
