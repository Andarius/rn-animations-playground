import { Colors } from '@src/theme'
import * as shape from 'd3-shape'
import React, {
    useCallback,
    useEffect,
    useImperativeHandle,
    useState
} from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    PinchGestureHandler
} from 'react-native-gesture-handler'
import Animated, {
    interpolate,
    useAnimatedGestureHandler,
    useDerivedValue,
    useSharedValue
} from 'react-native-reanimated'
import { parse, Path as RPath } from 'react-native-redash'
import Svg, { Circle, Defs, Marker } from 'react-native-svg'
import { buildGraph } from '../../LinechartScreen/Linechart/utils'
import { AnimatedG, AnimatedLine, AnimatedPath } from './AnimatedSvg'
import { usePinchGesture } from './utils'

type PanContext = {
    tmpOffsetX: number
    tmpOffsetY: number
}

type CurveType = shape.CurveFactory | shape.CurveFactoryLineOnly

export type AnimatedValues = {
    scale: Animated.SharedValue<number>
    translateX: Animated.SharedValue<number>
    focalX: Animated.SharedValue<number>
    scaleOffset: Animated.SharedValue<number | undefined>
    translateNorm: Animated.SharedValue<number | undefined>
}

export type Props = {
    width: number
    height: number
    data: [number, number][]
    curve?: CurveType
    graphRef?: React.MutableRefObject<ZoomableChartRef | undefined>
    showDots?: boolean
    style?: StyleProp<ViewStyle>
    showDebug?: boolean
}

export type ZoomableChartRef = {
    reset: () => void
    getAnimatedValues: () => AnimatedValues
}

const ZoomableChart = function ({
    width,
    height,
    data,
    curve = shape.curveMonotoneX,
    graphRef,
    style,
    showDots = false,
    showDebug = false
}: Props) {
    const [path, setPath] = useState<RPath>(() =>
        parse(buildGraph(data, width, height, { curve: curve }).path)
    )

    useEffect(() => {
        const graph = buildGraph(data, width, height, { curve })
        setPath(parse(graph.path))
    }, [data, width, height, curve])

    const _translateX = useSharedValue<number>(0)
    const _translateY = useSharedValue<number>(0)

    const _offsetX = useSharedValue<number>(0)
    const _offsetY = useSharedValue<number>(0)
    const {
        onPinchEvent,
        scale,
        scaleOffset,
        reset: resetPinch,
        focalX
    } = usePinchGesture(1, _offsetX, width)

    const translateX = useDerivedValue(() => {
        return scaleOffset.value !== undefined
            ? scaleOffset.value
            : _translateX.value + _offsetX.value
    }, [scaleOffset, _translateX, _offsetX])

    const maxTranslateX = useDerivedValue(() => {
        return width * (scale.value - 1)
    }, [width, scale])

    const translateNorm = useDerivedValue(() => {
        return interpolate(
            -translateX.value,
            [0, width * (scale.value - 1)],
            [0, 1]
        )
    }, [width, translateX, scale])

    const onGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        PanContext
    >(
        {
            onStart: (_, ctx) => {
                ctx.tmpOffsetX = 0
                ctx.tmpOffsetY = 0
            },
            onActive: (event) => {
                const _currTranslate = _offsetX.value + event.translationX // + scaleOffset.value
                if (
                    _currTranslate < 0 &&
                    _currTranslate > -maxTranslateX.value
                ) {
                    _translateX.value = event.translationX
                    _translateY.value = event.translationY
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
                ctx.tmpOffsetY = _translateY.value

                _translateX.value = 0
                _translateY.value = 0

                _offsetX.value += ctx.tmpOffsetX
                _offsetY.value += ctx.tmpOffsetY
            }
        },
        []
    )

    const reset = useCallback(() => {
        _translateX.value = 0
        _translateY.value = 0
        _offsetX.value = 0
        _offsetY.value = 0
        resetPinch()
    }, [_offsetX, _offsetY, _translateX, _translateY, resetPinch])

    useImperativeHandle(graphRef, () => ({
        reset: reset,
        getAnimatedValues: () => ({
            scale,
            translateX,
            focalX,
            scaleOffset,
            translateNorm
        })
    }))

    //https://docs.swmansion.com/react-native-gesture-handler/docs/api/gesture-handlers/pan-gh
    return (
        <PanGestureHandler minDist={10} maxPointers={1} {...{ onGestureEvent }}>
            <Animated.View>
                <PinchGestureHandler onGestureEvent={onPinchEvent}>
                    <Animated.View
                        style={[
                            {
                                //@ts-expect-error
                                height: height + (style?.borderWidth ?? 0) * 2,
                                //@ts-expect-error
                                width: width + (style?.borderWidth ?? 0) * 2
                            },
                            style
                        ]}>
                        <Svg style={{ backgroundColor: Colors.background }}>
                            <Defs>
                                <Marker
                                    id="dot"
                                    viewBox="0 0 10 10"
                                    refX="5"
                                    refY="5"
                                    markerWidth="5"
                                    markerHeight="5">
                                    <Circle
                                        opacity={showDots ? 1 : 0}
                                        cx="5"
                                        cy="5"
                                        r="5"
                                        fill={Colors.primary}
                                    />
                                </Marker>
                            </Defs>
                            <AnimatedG translateX={translateX}>
                                <AnimatedPath path={path} scale={scale} />
                            </AnimatedG>

                            {/* For debug purposes */}
                            {showDebug && (
                                <AnimatedLine
                                    x={focalX}
                                    height={height}
                                    stroke={Colors.secondary}
                                    strokeWidth={2}
                                />
                            )}
                        </Svg>
                    </Animated.View>
                </PinchGestureHandler>
            </Animated.View>
        </PanGestureHandler>
    )
}

export { ZoomableChart }
