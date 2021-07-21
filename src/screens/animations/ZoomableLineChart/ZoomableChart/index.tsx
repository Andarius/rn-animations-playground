import { Colors } from '@src/theme'
import * as shape from 'd3-shape'
import React, { useEffect, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    PinchGestureHandler,
    PinchGestureHandlerGestureEvent
} from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { parse, Path as RPath } from 'react-native-redash'
import Svg, { Circle, Defs, Marker } from 'react-native-svg'
import { buildGraph } from '../../LinechartScreen/Linechart/utils'
import { AnimatedG, AnimatedPath } from './AnimatedSvg'
import { useZoomableChart } from './utils'
export { useZoomableChart }
export { ZoomableChart }

type CurveType = shape.CurveFactory | shape.CurveFactoryLineOnly

export type UseZoomableProps = {
    onPanEvent: (event: PanGestureHandlerGestureEvent) => void
    onPinchEvent: (event: PinchGestureHandlerGestureEvent) => void
    translateX: Readonly<Animated.SharedValue<number>>
    scale: Readonly<Animated.SharedValue<number>>
}

export type Props = {
    width: number
    height: number
    data: [number, number][]
    curve?: CurveType
    showDots?: boolean
    style?: StyleProp<ViewStyle>
} & UseZoomableProps

const ZoomableChart = function ({
    width,
    height,
    data,
    curve = shape.curveMonotoneX,
    style,
    showDots = false,
    onPanEvent,
    onPinchEvent,
    translateX,
    scale
}: Props) {
    const [path, setPath] = useState<RPath>(() =>
        parse(buildGraph(data, width, height, { curve }).path)
    )

    useEffect(() => {
        const graph = buildGraph(data, width, height, { curve })
        setPath(parse(graph.path))
    }, [data, width, height, curve])

    //https://docs.swmansion.com/react-native-gesture-handler/docs/api/gesture-handlers/pan-gh
    return (
        <PanGestureHandler
            minDist={3}
            maxPointers={1}
            onGestureEvent={onPanEvent}>
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
                                <AnimatedPath {...{ path, scale }} />
                            </AnimatedG>
                        </Svg>
                    </Animated.View>
                </PinchGestureHandler>
            </Animated.View>
        </PanGestureHandler>
    )
}
