import { clamp } from '@src/animUtils'
import { Colors } from '@src/theme'
import React, { FC } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedProps,
    useSharedValue
} from 'react-native-reanimated'
import { parse, Path as RPath, serialize } from 'react-native-redash'
import Svg, { Color, Path } from 'react-native-svg'
import { Cursor } from './Cursor'
import { buildGraph, Config } from './utils'

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

type DataPoint = {
    x: number
    y: number
}

export type LineItem = {
    data: DataPoint[]
    color?: Color
    config?: Config
    currentValue: Animated.SharedValue<number>
}

export type GraphProps = {
    lines: LineItem[]
    height: number
    width: number
    containerStyle?: StyleProp<ViewStyle>
    config?: Config
}

const Graph: FC<GraphProps> = function ({
    lines,
    width,
    height,
    containerStyle,
    config
}) {
    // const translateX = useSharedValue<number>(0)
    // const translateY = useSharedValue<number>(height)

    const _graphs = lines.map((x) => {
        const { path, ...rest } = buildGraph(
            x.data.map((p) => [p.x, p.y]),
            width,
            height,
            x.config ?? config
        )
        return { path: parse(path), ...rest }
    })

    const xPosition = useSharedValue(0)
    const yPosition = useSharedValue(height)

    const onGestureEvent = useAnimatedGestureHandler({
        onStart: (event) => {
            xPosition.value = clamp(event.x, 0, width)
            yPosition.value = clamp(event.y, 0, height)
        },
        onActive: (event) => {
            xPosition.value = clamp(event.x, 0, width)
            yPosition.value = clamp(event.y, 0, height)
        },
        onEnd: () => {}
    })

    return (
        <View>
            <Svg width={width} height={height} style={containerStyle}>
                {_graphs.map((x, i) => (
                    <Line key={i} path={x.path} color={lines[i].color} />
                ))}
            </Svg>
            <View style={{ ...StyleSheet.absoluteFillObject }}>
                <PanGestureHandler {...{ onGestureEvent }}>
                    <Animated.View style={{ ...StyleSheet.absoluteFillObject }}>
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
                                color={lines[i].color}
                            />
                        ))}
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </View>
    )
}

export { Graph }
