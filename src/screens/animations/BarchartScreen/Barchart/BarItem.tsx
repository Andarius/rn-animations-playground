import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    withTiming
} from 'react-native-reanimated'

const TEXT_HEIGHT = 30
const TEXT_WIDTH = 40

const styles = StyleSheet.create({
    bar: {
        borderRadius: 20
    },
    labelText: {
        fontSize: 12
        // height: 20
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

type BarProps = {
    value: number
    label: string
    barColor: string
    labelColor: string
    maxValue: number
    minValue: number
    minHeight: number
    maxHeight: number
    animate?: boolean
    mounted: Animated.SharedValue<boolean>
    horizontal: boolean
}

export const VerticalBarItem: FC<BarProps> = function ({
    value,
    label,
    barColor,
    labelColor,
    minValue,
    maxValue,
    minHeight,
    maxHeight,
    animate,
    mounted
}) {
    const _barSize = interpolate(
        value,
        [minValue, maxValue],
        [minHeight, maxHeight - TEXT_HEIGHT],
        Animated.Extrapolate.CLAMP
    )

    const barSize = useDerivedValue(() => {
        return animate
            ? mounted.value
                ? withTiming(_barSize, { duration: 300 })
                : 0
            : _barSize
    })

    const animatedStyle = useAnimatedStyle(() => ({
        height: barSize.value
    }))

    return (
        <View style={{ alignItems: 'center' }}>
            <Animated.View
                style={[
                    animatedStyle,
                    styles.bar,
                    { backgroundColor: barColor, width: 10 }
                ]}
            />
            <View style={[styles.textContainer, { height: TEXT_HEIGHT }]}>
                <Text
                    numberOfLines={1}
                    style={[styles.labelText, { color: labelColor }]}>
                    {label}
                </Text>
            </View>
        </View>
    )
}

export const HorizontalBarItem: FC<BarProps> = function ({
    value,
    label,
    barColor,
    labelColor,
    minValue,
    maxValue,
    minHeight,
    maxHeight,
    animate,
    mounted
}) {
    // const _height = useSharedValue<number>(0)

    const _barSize = interpolate(
        value,
        [minValue, maxValue],
        [minHeight, maxHeight - TEXT_WIDTH],
        Animated.Extrapolate.CLAMP
    )

    const barSize = useDerivedValue(() => {
        return animate
            ? mounted.value
                ? withTiming(_barSize, { duration: 300 })
                : 0
            : _barSize
    })

    const animatedStyle = useAnimatedStyle(() => ({
        width: barSize.value
        // width: barSize.value,
        // height: 10
    }))

    return (
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <View style={[styles.textContainer, { width: TEXT_WIDTH }]}>
                <Text
                    numberOfLines={1}
                    style={[styles.labelText, { color: labelColor }]}>
                    {label}
                </Text>
            </View>
            <Animated.View
                style={[
                    animatedStyle,
                    styles.bar,
                    { backgroundColor: barColor, height: 10 }
                ]}
            />
        </View>
    )
}
