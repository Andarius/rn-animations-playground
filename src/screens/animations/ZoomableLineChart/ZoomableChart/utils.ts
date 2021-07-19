import { useCallback } from 'react'
import {
    PanGestureHandlerGestureEvent,
    PinchGestureHandlerGestureEvent
} from 'react-native-gesture-handler'
import Animated, {
    Easing,
    interpolate,
    useAnimatedGestureHandler,
    useDerivedValue,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'

const MAX_ZOOM = 100

type PinchContext = {
    scaleEvent: 'ZOOMING' | 'DEZOOMING' | undefined
}

const DEZOOM_MUTLTIPLIER = 7
const ZOOM_MUTLTIPLIER = 3

export type PinchGestureProps = {
    offsetX: Animated.SharedValue<number>
    focalX: Animated.SharedValue<number>
    scale: Animated.SharedValue<number>
    width: number
}

export const usePinchGesture = function ({
    offsetX,
    scale,
    focalX,
    width
}: PinchGestureProps) {
    const _tmpScale = useSharedValue<number>(1)
    const _isScaling = useSharedValue<boolean>(false)

    const scaleOffset = useDerivedValue(() => {
        if (_isScaling.value) {
            const r =
                (Math.abs(offsetX.value) + focalX.value) *
                    (scale.value / _tmpScale.value) -
                focalX.value
            return -r
        }
        return undefined
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
                    _tmpScale.value +
                    (event.scale - 1) *
                        (ctx.scaleEvent === 'ZOOMING'
                            ? ZOOM_MUTLTIPLIER
                            : DEZOOM_MUTLTIPLIER)

                scale.value = Math.min(Math.max(1, _newScale), MAX_ZOOM)
            },
            onEnd: (_) => {
                _tmpScale.value = scale.value
                if (scaleOffset.value === undefined)
                    throw new Error('scaleOffset must not be undefined')
                offsetX.value = scaleOffset.value
                _isScaling.value = false
            }
        },
        []
    )

    const reset = useCallback(() => {
        _tmpScale.value = 1
    }, [_tmpScale])

    return { onPinchEvent, reset, scaleOffset }
}

type PanContext = {
    tmpOffsetX: number
    tmpOffsetY: number
}

export const usePanGesture = function (
    offsetX: Animated.SharedValue<number>,
    maxTranslateX: Readonly<Animated.SharedValue<number>>
) {
    const _translateX = useSharedValue<number>(0)

    const translateX = useDerivedValue(() => {
        return _translateX.value + offsetX.value
    }, [_translateX, offsetX])

    const onPanEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        PanContext
    >(
        {
            onStart: (_, ctx) => {
                ctx.tmpOffsetX = 0
                ctx.tmpOffsetY = 0
            },
            onActive: (event) => {
                const _currTranslate = offsetX.value + event.translationX // + scaleOffset.value
                if (
                    _currTranslate < 0 &&
                    _currTranslate > -maxTranslateX.value
                ) {
                    _translateX.value = event.translationX
                } else {
                    // Left bound
                    if (translateX.value !== 0 && _currTranslate > 0)
                        _translateX.value -= translateX.value
                    // Right bound
                    if (
                        -translateX.value !== maxTranslateX.value &&
                        _currTranslate + maxTranslateX.value < 0
                    ) {
                        _translateX.value -=
                            translateX.value + maxTranslateX.value
                    }
                }
            },
            onEnd: (_, ctx) => {
                ctx.tmpOffsetX = _translateX.value
                _translateX.value = 0
                offsetX.value += ctx.tmpOffsetX
            }
        },
        []
    )

    const reset = useCallback(() => {
        _translateX.value = 0
    }, [_translateX])

    return { onPanEvent, translateX, reset }
}

export type UseZoomableChartProps = {
    width: number
    offsetX?: Animated.SharedValue<number>
    scale?: Animated.SharedValue<number>
    focalX?: Animated.SharedValue<number>
}

export const useZoomableChart = function (props: UseZoomableChartProps) {
    const { width } = props
    const offsetX = props?.offsetX ?? useSharedValue<number>(0)
    const scale = props?.scale ?? useSharedValue<number>(1)
    const focalX = props?.focalX ?? useSharedValue<number>(0)

    const maxTranslateX = useDerivedValue(() => {
        return width * (scale.value - 1)
    }, [width, scale])

    const { onPinchEvent, scaleOffset, reset: resetPinch } = usePinchGesture({
        scale,
        focalX,
        offsetX,
        width
    })

    const {
        translateX: panTranslateX,
        onPanEvent,
        reset: resetPan
    } = usePanGesture(offsetX, maxTranslateX)

    const translateX = useDerivedValue(() => {
        return scaleOffset.value !== undefined
            ? scaleOffset.value
            : panTranslateX.value
    }, [scaleOffset, panTranslateX])

    const reset = useCallback(() => {
        offsetX.value = 0
        scale.value = 1
        focalX.value = 0
        resetPan()
        resetPinch()
    }, [resetPan, resetPinch, offsetX, scale, focalX])

    const translateNorm = useDerivedValue(() => {
        return interpolate(
            -panTranslateX.value,
            [0, width * (scale.value - 1)],
            [0, 1]
        )
    }, [width, panTranslateX, scale])

    return {
        offsetX,
        scale,
        focalX,
        translateX,
        translateNorm,
        scaleOffset,
        onPinchEvent,
        onPanEvent,
        reset
    }
}
