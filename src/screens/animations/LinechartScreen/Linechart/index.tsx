import { clamp } from '@src/animUtils'
import { Colors } from '@src/theme'
import React, { FC } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
    useAnimatedProps,
    useSharedValue
} from 'react-native-reanimated'
import { parse, Path as RPath, serialize } from 'react-native-redash'
import Svg, { Color, Path } from 'react-native-svg'
import { Cursor } from './Cursor'
import { buildGraph, Config, GraphData } from './utils'

const AnimatedPath = Animated.createAnimatedComponent(Path)

type LineProps = {
    path: RPath
    color?: Color
    width?: number
}

const Line: FC<LineProps> = function ({
    path,
    color = Colors.primary,
    width = 2
}) {
    const animatedProps = useAnimatedProps(() => {
        return {
            d: serialize(path)
        }
    })
    return (
        <AnimatedPath
            animatedProps={animatedProps}
            fill="transparent"
            stroke={color}
            strokeWidth={width}
        />
    )
}

export type DataPoint = {
    x: number
    y: number
}

export type LineGraph = Omit<GraphData, 'path'> & { path: RPath }

export type LineItem = {
    data?: DataPoint[]
    graph?: LineGraph
    color?: Color
    config?: Config
    currentValue?: Animated.SharedValue<number>
}

export type LinechartProps = {
    lines: LineItem[]
    height: number
    width: number
    containerStyle?: StyleProp<ViewStyle>
    style?: StyleProp<ViewStyle>
    config?: Config
    showCursor?: boolean
}

const Linechart: FC<LinechartProps> = function ({
    lines,
    width,
    height,
    style,
    containerStyle,
    config,
    showCursor = true,
    children
}) {
    const _graphs = lines.map((x) => {
        if (x.graph) return x.graph
        if (x.data) {
            const { path, ...rest } = buildGraph(
                x.data.map((p) => [p.x, p.y]),
                width,
                height,
                x.config ?? config
            )
            return { path: parse(path), ...rest }
        }
        throw new Error('Either `graph` or `data` must be specified')
    })

    const xPosition = useSharedValue(0)
    const yPosition = useSharedValue(height)

    const gesture = Gesture.Pan()
        .onBegin((event) => {
            xPosition.value = clamp(event.x, 0, width)
            yPosition.value = clamp(event.y, 0, height)
        })
        .onUpdate((event) => {
            xPosition.value = clamp(event.x, 0, width)
            yPosition.value = clamp(event.y, 0, height)
        })

    return (
        <View style={containerStyle}>
            <Svg width={width} height={height} style={style}>
                {children}
                {_graphs.map((x, i) => (
                    <Line key={i} path={x.path} color={lines[i].color} />
                ))}
            </Svg>
            {showCursor && (
                <View style={{ ...StyleSheet.absoluteFillObject }}>
                    <GestureDetector gesture={gesture}>
                        <Animated.View
                            style={{ ...StyleSheet.absoluteFillObject }}>
                            {_graphs.map((x, i) => (
                                <Cursor
                                    key={i}
                                    path={x.path}
                                    maxWidth={width}
                                    maxHeight={height}
                                    minValue={x.minY}
                                    maxValue={x.maxY}
                                    currentValue={lines[i].currentValue}
                                    position={{ x: xPosition, y: yPosition }}
                                    color={lines[i].color as string}
                                />
                            ))}
                        </Animated.View>
                    </GestureDetector>
                </View>
            )}
        </View>
    )
}

export { Linechart }
