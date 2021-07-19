import { Colors } from '@src/theme'
import React, { FC } from 'react'
import Animated, { useAnimatedProps } from 'react-native-reanimated'
import { Path as RPath } from 'react-native-redash'
import { G, GProps, Line, LineProps, Path, PathProps } from 'react-native-svg'

const _AnimatedPath = Animated.createAnimatedComponent(Path)
const _AnimatedG = Animated.createAnimatedComponent(G)
const _AnimatedLine = Animated.createAnimatedComponent(Line)

export const serializeScale = function (
    path: RPath,
    scaleX?: Animated.SharedValue<number>,
    scaleY?: Animated.SharedValue<number>
) {
    'worklet'
    const _scaleX = scaleX ? scaleX.value : 1
    const _scaleY = scaleY ? scaleY.value : 1
    const _path = `M${path.move.x},${path.move.y} ${path.curves
        .map(
            (c) =>
                `C${(c.c1.x * _scaleX).toFixed(2)},${(c.c1.y * _scaleY).toFixed(
                    2
                )} ${(c.c2.x * _scaleX).toFixed(2)},${(
                    c.c2.y * _scaleY
                ).toFixed(2)} ${(c.to.x * _scaleX).toFixed(2)},${(
                    c.to.y * _scaleY
                ).toFixed(2)}`
        )
        .join(' ')}${path.close ? 'Z' : ''}`
    return _path
}
type AnimatedPathProps = {
    path: RPath
    color?: string
    strokeWidth?: number
    scale?: Animated.SharedValue<number>
}

const AnimatedPath: FC<AnimatedPathProps> = function ({
    path,
    color = Colors.primary,
    strokeWidth = 2,
    scale
}) {
    const animatedProps = useAnimatedProps<PathProps>(() => {
        return {
            d: serializeScale(path, scale),
            markerStart: 'url(#dot)',
            markerMid: 'url(#dot)',
            markerEnd: 'url(#dot)'
        }
    }, [path, scale])
    return (
        <_AnimatedPath
            animatedProps={animatedProps}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
        />
    )
}

type AnimatedGProps = {
    translateX: Animated.SharedValue<number>
}

const AnimatedG: FC<AnimatedGProps> = function ({ translateX, children }) {
    //@ts-expect-error
    const animatedProps = useAnimatedProps<GProps>(() => {
        return {
            transform: [{ translateX: translateX.value }]
        }
    }, [translateX])
    return <_AnimatedG animatedProps={animatedProps}>{children}</_AnimatedG>
}

type AnimatedLineProps = {
    x: Animated.SharedValue<number>
    height: number
    stroke?: string
    strokeWidth?: number
}

const AnimatedLine: FC<AnimatedLineProps> = function ({
    x,
    height,
    stroke = Colors.secondary,
    strokeWidth = 2
}) {
    const animatedProps = useAnimatedProps<LineProps>(() => {
        return {
            x1: x.value,
            x2: x.value
        }
    }, [x])
    return (
        <_AnimatedLine
            animatedProps={animatedProps}
            stroke={stroke}
            strokeWidth={strokeWidth}
            y1={0}
            y2={height}
        />
    )
}

export { AnimatedPath, AnimatedG, AnimatedLine }
