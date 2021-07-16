import { useCallback } from 'react'
import { PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import Animated, {
    Easing,
    useAnimatedGestureHandler,
    useDerivedValue,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'

const MAX_ZOOM = 100

type PinchContext = {
    scaleEvent: 'ZOOMING' | 'DEZOOMING' | undefined
}

// const SPRING_CONFIG: Animated.WithSpringConfig = {
//     mass: 1,
//     stiffness: 150,
//     damping: 30,
//     overshootClamping: false,
//     restSpeedThreshold: 0.001,
//     restDisplacementThreshold: 0.001
//     // velocity: event.velocityY
// }

const DEZOOM_MUTLTIPLIER = 7
const ZOOM_MUTLTIPLIER = 3

export const usePinchGesture = function (
    initScale: number = 1,
    offsetX: Animated.SharedValue<number>,
    width: number
) {
    const scale = useSharedValue<number>(initScale)
    const focalX = useSharedValue<number>(0)
    const _tmpScale = useSharedValue<number>(0)
    const _isScaling = useSharedValue<boolean>(false)

    const scaleOffset = useDerivedValue(() => {
        return _isScaling.value ? (1 - scale.value) * focalX.value : undefined
    })

    /**
     * Keep the left / right boundaries in place if we dezoom
     * when all left or all right
     */
    // useAnimatedReaction(
    //     () => {
    //         return scaleOffset.value
    //     },
    //     (_scaleOffset) => {
    //         if (
    //             Math.abs(_offsetX.value) > Math.abs(scaleOffset.value) &&
    //             focalX.value !== 0
    //         ) {
    //             console.log('ENTER REAXT')
    //             _offsetX.value =
    //                 _offsetX.value < 0 ? scaleOffset.value : -scaleOffset.value
    //         }
    //     },
    //     []
    // )

    const onPinchEvent = useAnimatedGestureHandler<
        PinchGestureHandlerGestureEvent,
        PinchContext
    >(
        {
            onStart: (_, ctx) => {
                ctx.scaleEvent = undefined
                // We want the init focal to be centered first
                // at the center of the screen
                focalX.value = (width / 2 - offsetX.value) / scale.value
            },
            onActive: (event, ctx) => {
                if (ctx.scaleEvent === undefined) {
                    _isScaling.value = true
                    ctx.scaleEvent = event.scale < 1 ? 'DEZOOMING' : 'ZOOMING'
                    const newFocal =
                        (event.focalX - offsetX.value) / scale.value

                    focalX.value =
                        scale.value === 1
                            ? newFocal
                            : withTiming(newFocal, {
                                  duration: 300,
                                  easing: Easing.linear
                              })
                }
                /**
                 *  ctx.scaleEvent === 'ZOOMING'
                        ? Math.exp(event.scale - 1)
                        : (event.scale - 1) * DEZOOM_MUTLTIPLIER
                 */
                const _newScale =
                    1 +
                    _tmpScale.value +
                    (event.scale - 1) *
                        (ctx.scaleEvent === 'ZOOMING'
                            ? ZOOM_MUTLTIPLIER
                            : DEZOOM_MUTLTIPLIER)

                scale.value = Math.min(Math.max(1, _newScale), MAX_ZOOM)
            },
            onEnd: (_) => {
                _tmpScale.value = scale.value - 1
                if (scaleOffset.value === undefined)
                    throw new Error('scaleOffset must not be undefined')
                console.log('end focal: ', focalX.value)
                offsetX.value = scaleOffset.value
                _isScaling.value = false
            }
        },
        []
    )

    const reset = useCallback(() => {
        scale.value = initScale
        _tmpScale.value = 0
        focalX.value = 0
    }, [scale, _tmpScale, initScale, focalX])

    return { onPinchEvent, scale, focalX, reset, scaleOffset }
}

export const getCirclePosition = function (
    x: number,
    y: number,
    height: number
) {
    return { cx: x, cy: height - y }
}
