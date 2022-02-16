import { useCallback } from 'react'
import { Gesture } from 'react-native-gesture-handler'
import Animated, {
    Easing,
    interpolate,
    useDerivedValue,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'

type ScaleEvent = 'ZOOMING' | 'DEZOOMING' | undefined

export type PinchGestureProps = {
    offsetX: Animated.SharedValue<number>
    width: number
    initScale: number
    zoomMax?: number
    zoomModifierWl?: (scale: number, isZooming: boolean) => number
}

export const usePinchGesture = function ({
    offsetX,
    initScale,
    width,
    zoomMax = 100
}: PinchGestureProps) {
    const _isScaling = useSharedValue<boolean>(false)
    const focalX = useSharedValue<number>(0)

    const _currentScale = useSharedValue<number>(initScale)
    const _lastScale = useSharedValue<number>(initScale)
    const scaleEvent = useSharedValue<ScaleEvent>(undefined)

    const scale = useDerivedValue(() => {
        const _scale = _lastScale.value * _currentScale.value
        return Math.min(Math.max(initScale, _scale), zoomMax)
    }, [initScale, zoomMax])

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
                    (scale.value / _lastScale.value) -
                focalX.value
            // We want to stay between the left / right boundaries
            const r2 = Math.min(Math.max(r, 0), maxTranslateX.value)
            return -r2
        }
        return undefined
    })

    const pinchGesture = Gesture.Pinch()
        .onBegin((_) => {
            scaleEvent.value = undefined
            // We want the init focal to be centered first
            // at the center of the screen
            focalX.value = (width / 2 - offsetX.value) / scale.value
        })
        .onUpdate((event) => {
            if (scaleEvent.value === undefined) {
                _isScaling.value = true
                scaleEvent.value = event.scale < 1 ? 'DEZOOMING' : 'ZOOMING'
                const newFocal = (event.focalX - offsetX.value) / scale.value

                focalX.value =
                    scale.value === 1
                        ? newFocal
                        : withTiming(newFocal, {
                              duration: 300,
                              easing: Easing.linear
                          })
            }

            _currentScale.value = event.scale
        })
        .onEnd((_) => {
            _currentScale.value = initScale
            _lastScale.value = scale.value
            if (scaleOffset.value === undefined)
                throw new Error('scaleOffset must not be undefined')
            offsetX.value = scaleOffset.value
            _isScaling.value = false
        })

    const reset = useCallback(() => {
        _isScaling.value = false
        _lastScale.value = initScale
        _currentScale.value = initScale
        focalX.value = 0
    }, [_currentScale, _isScaling, _lastScale, focalX, initScale])

    return { pinchGesture, reset, scaleOffset, maxTranslateX, scale, focalX }
}

export const usePanGesture = function (
    offsetX: Animated.SharedValue<number>,
    maxTranslateX: Readonly<Animated.SharedValue<number>>
) {
    const tmpTranslate = useSharedValue<number>(0)
    const tmpOffsetX = useSharedValue<number | undefined>(0)

    const translateX = useDerivedValue(() => {
        return tmpTranslate.value + offsetX.value
    }, [tmpTranslate, offsetX])

    const panGesture = Gesture.Pan()
        .onBegin((_) => {
            tmpOffsetX.value = undefined
        })
        .onUpdate((event) => {
            const _currTranslate = offsetX.value + event.translationX

            tmpTranslate.value =
                _currTranslate < -maxTranslateX.value
                    ? -maxTranslateX.value - offsetX.value
                    : _currTranslate > 0
                    ? -offsetX.value
                    : event.translationX
        })
        .onEnd((_) => {
            tmpOffsetX.value = tmpTranslate.value
            tmpTranslate.value = 0
            offsetX.value += tmpOffsetX.value
        })

    const reset = useCallback(() => {
        tmpTranslate.value = 0
    }, [tmpTranslate])

    return { panGesture, translateX, reset }
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

    const {
        pinchGesture,
        scaleOffset,
        scale,
        focalX,
        reset: resetPinch,
        maxTranslateX
    } = usePinchGesture({
        initScale,
        offsetX,
        width
    })

    const {
        panGesture,
        translateX: panTranslate,
        reset: resetPan
    } = usePanGesture(offsetX, maxTranslateX)

    const translateX = useDerivedValue(() => {
        return scaleOffset.value !== undefined
            ? scaleOffset.value
            : panTranslate.value
    }, [scaleOffset, panTranslate])

    const translateNorm = useDerivedValue(() => {
        return interpolate(
            -translateX.value,
            [0, width * (scale.value - 1)],
            [0, 1]
        )
    }, [width, translateX, scale])

    const reset = useCallback(() => {
        offsetX.value = 0
        resetPinch()
        resetPan()
    }, [offsetX, resetPan, resetPinch])

    return {
        offsetX,
        scale,
        focalX,
        translateX,
        translateNorm,
        scaleOffset,
        pinchGesture,
        panGesture,
        reset
    }
}
