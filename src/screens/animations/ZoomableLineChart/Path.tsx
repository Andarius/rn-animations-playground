import { Colors } from '@src/theme'
import React, { FC } from 'react'
import Animated, { useAnimatedProps } from 'react-native-reanimated'
import { Path as RPath } from 'react-native-redash'
import { Path, PathProps } from 'react-native-svg'

const AnimatedPath = Animated.createAnimatedComponent(Path)

export const serializeScale = function (
    path: RPath,
    scaleX?: Animated.SharedValue<number>,
    scaleY?: Animated.SharedValue<number>
) {
    'worklet'
    const _scaleX = scaleX ? scaleX.value : 1
    const _scaleY = scaleY ? scaleY.value : 1
    return `M${path.move.x},${path.move.y} ${path.curves
        .map(
            (c) =>
                `C${c.c1.x * _scaleX},${c.c1.y * _scaleY} ${c.c2.x * _scaleX},${
                    c.c2.y * _scaleY
                } ${c.to.x * _scaleX},${c.to.y * _scaleY}`
        )
        .join(' ')}${path.close ? 'Z' : ''}`
}

type LineProps = {
    path: RPath
    color?: string
    strokeWidth?: number
    scale?: Animated.SharedValue<number>
    translateX?: Animated.SharedValue<number>
}

const Line: FC<LineProps> = function ({
    path,
    color = Colors.primary,
    strokeWidth = 2,
    scale,
    translateX
}) {
    //@ts-expect-error
    const animatedProps = useAnimatedProps<PathProps>(() => {
        return {
            d: serializeScale(path, scale),
            transform: [{ translateX: translateX?.value ?? 0 }]
        }
    })
    return (
        <AnimatedPath
            animatedProps={animatedProps}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
        />
    )
}
export { Line }
