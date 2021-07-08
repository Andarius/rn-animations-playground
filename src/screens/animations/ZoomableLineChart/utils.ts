import { useCallback } from 'react'
import { PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue
} from 'react-native-reanimated'

type PinchContext = {
    scaleEvent: 'ZOOMING' | 'DEZOOMING' | undefined
}

export const usePinchGesture = function (initScale: number = 1) {
    const scale = useSharedValue<number>(initScale)
    const tmpScale = useSharedValue<number>(0)

    const onPinchEvent = useAnimatedGestureHandler<
        PinchGestureHandlerGestureEvent,
        PinchContext
    >(
        {
            onStart: (_, ctx) => {
                // console.log(
                //     `[Pinch] Start: prev ${tmpScale.value} | ${scale.value}`
                // )
                ctx.scaleEvent = undefined
            },
            onActive: (event, ctx) => {
                if (ctx.scaleEvent === undefined) {
                    ctx.scaleEvent = event.scale < 1 ? 'DEZOOMING' : 'ZOOMING'
                    if (tmpScale.value !== 0)
                        tmpScale.value +=
                            ctx.scaleEvent === 'DEZOOMING' ? +0 : -1
                }
                scale.value = Math.max(
                    1,
                    (event.scale < 1 ? -(1 - event.scale) * 3 : event.scale) +
                        tmpScale.value
                )
            },
            onEnd: (_) => {
                tmpScale.value = scale.value
                // console.log(
                //     `[Pinch] End: prev ${tmpScale.value} | ${scale.value}`
                // )
            }
        },
        []
    )

    const reset = useCallback(() => {
        scale.value = 1
        tmpScale.value = 0
    }, [scale, tmpScale])

    return { onPinchEvent, scale, reset }
}

type CanMove = {
    down: Animated.SharedValue<boolean>
    up: Animated.SharedValue<boolean>
}
