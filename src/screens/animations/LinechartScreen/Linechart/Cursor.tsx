import { clamp } from '@src/animUtils'
import { Colors } from '@src/theme'
import React, { FC } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
    interpolate,
    useAnimatedStyle,
    useDerivedValue
} from 'react-native-reanimated'
import { getYForX, Path } from 'react-native-redash'

const CURSOR_SIZE = 15

const styles = StyleSheet.create({
    cursor: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export type Props = {
    path: Path
    position: {
        x: Animated.SharedValue<number>
        y: Animated.SharedValue<number>
    }
    maxWidth: number
    size?: number
    maxHeight: number
    minValue: number
    maxValue: number
    currentValue?: Animated.SharedValue<number>
    color?: string
}

const Cursor: FC<Props> = function ({
    path,
    position,
    maxWidth,
    maxHeight,
    minValue,
    maxValue,
    currentValue,
    color = Colors.primary,
    size = CURSOR_SIZE
}) {
    const translationX = useDerivedValue(() => {
        return clamp(position.x.value, 0, maxWidth)
    })
    const translationY = useDerivedValue(() => {
        const _value = getYForX(path, translationX.value)
        return _value ?? 0
    })

    const animatedStyle = useAnimatedStyle(() => {
        const translateX = translationX.value - size / 2
        const translateY = translationY.value - size / 2
        return {
            transform: [{ translateX }, { translateY }]
        }
    }, [size])

    useDerivedValue(() => {
        if (currentValue !== undefined)
            currentValue.value = interpolate(
                translationY.value,
                [0, maxHeight],
                [maxValue, minValue]
            )
    })

    return (
        <Animated.View
            style={[
                styles.cursor,
                {
                    backgroundColor: color,
                    width: size,
                    height: size,
                    borderRadius: size / 2
                },
                animatedStyle
            ]}
        />
    )
}

export { Cursor }
