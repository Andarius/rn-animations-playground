import React, { FC, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import { PanGestureHandler, PanGestureHandlerProperties } from 'react-native-gesture-handler'
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedReaction, useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring
} from 'react-native-reanimated'
import { GestureState, IDraggableItem, isOverlapping, ItemID } from './utils'

const SPRING_CONFIG: Animated.WithSpringConfig = {
    mass: 1,
    stiffness: 150,
    damping: 30,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001
    // velocity: event.velocityY
}

export type Props = {
    id: ItemID
    spacingY: number
    verticalOnly: boolean

    height: Animated.SharedValue<number>
    position: Animated.SharedValue<number>
    offset: Animated.SharedValue<number>

    itemWidth: number
    // defaultOffset?: number
    // Value
    overlayTreshPercentage: number
    index: number
    disabled: boolean
    activeOffsetY?: PanGestureHandlerProperties['activeOffsetY']
    items: IDraggableItem[]
}

const DraggableItem: FC<Props> = function ({
    children,
    id,
    spacingY,
    verticalOnly,
    height,
    position,
    offset,
    itemWidth,
    overlayTreshPercentage,
    disabled = false,
    activeOffsetY,
    items
}) {
    const { width } = useWindowDimensions()


    const gestureState = useSharedValue<GestureState>('CREATED')
    const x = useSharedValue(0)
    const y = useSharedValue(0)

    const tmpOffset = useSharedValue(0)
    const prevHeight = useSharedValue(height.value)

    const translateX = useDerivedValue(() => x.value)
    const translateY = useDerivedValue(() => {
        if (gestureState.value === 'ACTIVE') return y.value + offset.value
        // Will not animated on mount
        else if (gestureState.value === 'CREATED') return offset.value
        else return withSpring(offset.value, SPRING_CONFIG)
    })
    const maxY = useDerivedValue(() => translateY.value + height.value)

    const onGestureEvent = useAnimatedGestureHandler(
        {
            onStart: () => {
                gestureState.value = 'ACTIVE'
                tmpOffset.value = offset.value
            },
            onActive: (event, _) => {
                // x.value = x.value + event.translationX
                x.value = verticalOnly ? 0 : event.translationX
                y.value = event.translationY
                items.map((p) => {
                    const _isOverlapping = isOverlapping(
                        translateY.value,
                        maxY.value,
                        p.offset.value,
                        p.offset.value + p.height.value,
                        overlayTreshPercentage
                    )
                    if (p.id !== id && _isOverlapping) {
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

                        const tmpPosition = p.position.value
                        p.position.value = position.value
                        position.value = tmpPosition
                    }
                })
            },
            onEnd: (event, _) => {
                gestureState.value = 'IDLE'
                offset.value = tmpOffset.value
                tmpOffset.value = 0

                // Move back into position
                const springConfig = SPRING_CONFIG
                springConfig.velocity = event.velocityX
                x.value = withSpring(0, springConfig)
                y.value = withSpring(0, {
                    mass: 10,
                    stiffness: 300,
                    damping: 100,
                    overshootClamping: false,
                    restSpeedThreshold: 0.001,
                    restDisplacementThreshold: 0.001,
                    velocity: event.velocityY
                })
            }
        },
        [items, verticalOnly]
    )

    const style = useAnimatedStyle(() => ({
        zIndex: gestureState.value === 'ACTIVE' ? 100 : 0,
        height: height.value,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value }
            //   { scale: withSpring(gestureActive.value ? 1.1 : 1) },
        ]
    }))

    useEffect(() => {
        setTimeout(() => {
            gestureState.value = 'IDLE'
        }, 500)
    }, [gestureState])

    useAnimatedReaction(
        () => height.value,
        (newHeight: number) => {
            const diffHeight = newHeight - prevHeight.value
            if (diffHeight !== 0) {
                items.map((p) => {
                    if (p.id !== id && p.offset.value > offset.value)
                        p.offset.value = p.offset.value + diffHeight
                })
                prevHeight.value = newHeight
            }
        }
    , [items])
    return (
        <PanGestureHandler
            activeOffsetY={activeOffsetY}
            enabled={!disabled}
            {...{ onGestureEvent }}>
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        top: 0,
                        left: (width - itemWidth) / 2,
                        alignItems: 'center',
                        width: itemWidth,
                    },
                    style
                ]}>
                {children}
            </Animated.View>
        </PanGestureHandler>
    )
}

export { DraggableItem }
