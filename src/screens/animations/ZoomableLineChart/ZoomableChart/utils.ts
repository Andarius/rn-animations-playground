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
    tmpScale: Animated.SharedValue<number>
    width: number
}

export const usePinchGesture = function ({
    offsetX,
    scale,
    focalX,
    tmpScale,
    width
}: PinchGestureProps) {
    const _isScaling = useSharedValue<boolean>(false)

    const maxTranslateX = useDerivedValue(() => {
        return width * (scale.value - 1)
    }, [width, scale])

    /**
     * Thanks @same7m !
     */
    const scaleOffset = useDerivedValue(() => {
        if (_isScaling.value) {
            const r =
                (Math.abs(offsetX.value) + focalX.value) *
                    (scale.value / tmpScale.value) -
                focalX.value
            // We want to stay between the left / right boundaries
            const r2 = Math.min(Math.max(r, 0), maxTranslateX.value)
            return -r2
        }
        return undefined
    })

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
                    tmpScale.value +
                    (event.scale - 1) *
                        (ctx.scaleEvent === 'ZOOMING'
                            ? ZOOM_MUTLTIPLIER
                            : DEZOOM_MUTLTIPLIER)

                scale.value = Math.min(Math.max(1, _newScale), MAX_ZOOM)
            },
            onEnd: (_) => {
                tmpScale.value = scale.value
                if (scaleOffset.value === undefined)
                    throw new Error('scaleOffset must not be undefined')
                offsetX.value = scaleOffset.value
                _isScaling.value = false
            }
        },
        []
    )

    const reset = useCallback(() => {
        _isScaling.value = false
    }, [_isScaling])

    return { onPinchEvent, reset, scaleOffset, maxTranslateX }
}

type PanContext = {
    tmpOffsetX: number
    tmpOffsetY: number
}

export const usePanGesture = function (
    offsetX: Animated.SharedValue<number>,
    tmpTranslate: Animated.SharedValue<number>,
    maxTranslateX: Readonly<Animated.SharedValue<number>>
) {
    const translateX = useDerivedValue(() => {
        return tmpTranslate.value + offsetX.value
    }, [tmpTranslate, offsetX])

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
                    tmpTranslate.value = event.translationX
                } else {
                    // Left bound
                    if (translateX.value !== 0 && _currTranslate > 0)
                        tmpTranslate.value -= translateX.value
                    // Right bound
                    if (
                        -translateX.value !== maxTranslateX.value &&
                        _currTranslate + maxTranslateX.value < 0
                    ) {
                        tmpTranslate.value -=
                            translateX.value + maxTranslateX.value
                    }
                }
            },
            onEnd: (_, ctx) => {
                ctx.tmpOffsetX = tmpTranslate.value
                tmpTranslate.value = 0
                offsetX.value += ctx.tmpOffsetX
            }
        },
        []
    )

    return { onPanEvent, translateX }
}

export type UseZoomableChartProps = {
    width: number
    initScale?: number
}

export const useZoomableChart = function ({
    width,
    initScale = 1
}: UseZoomableChartProps) {
    const offsetX = useSharedValue<number>(0)
    const tmpTranslate = useSharedValue<number>(0)
    const scale = useSharedValue<number>(initScale)
    const focalX = useSharedValue<number>(0)
    const tmpScale = useSharedValue<number>(initScale)

    const {
        onPinchEvent,
        scaleOffset,
        reset: resetPinch,
        maxTranslateX
    } = usePinchGesture({
        scale,
        focalX,
        offsetX,
        width,
        tmpScale
    })

    const { translateX: panTranslateX, onPanEvent } = usePanGesture(
        offsetX,
        tmpTranslate,
        maxTranslateX
    )

    const translateX = useDerivedValue(() => {
        return scaleOffset.value !== undefined
            ? scaleOffset.value
            : panTranslateX.value
    }, [scaleOffset, panTranslateX])

    const translateNorm = useDerivedValue(() => {
        return interpolate(
            -translateX.value,
            [0, width * (scale.value - 1)],
            [0, 1]
        )
    }, [width, translateX, scale])

    const reset = useCallback(() => {
        offsetX.value = 0
        tmpTranslate.value = 0
        focalX.value = 0
        scale.value = initScale
        tmpScale.value = initScale
        resetPinch()
    }, [offsetX, tmpTranslate, focalX, scale, initScale, tmpScale, resetPinch])

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
