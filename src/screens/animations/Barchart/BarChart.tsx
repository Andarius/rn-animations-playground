import { Colors } from '@src/theme'
import React, { FC, useEffect } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import Animated, {
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'

const TEXT_HEIGHT = 20
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        flexDirection: 'row'
    },
    //
    bar: {
        width: 10,
        borderRadius: 20
    },
    labelText: {
        fontSize: 12
        // height: 20
    },
    textContainer: {
        height: TEXT_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export type DataItem = {
    value: number
    label: string
}

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
}

const BarItem: FC<BarProps> = function ({
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

    const _height = interpolate(
        value,
        [minValue, maxValue],
        [minHeight, maxHeight - TEXT_HEIGHT],
        Animated.Extrapolate.CLAMP
    )

    const height = useDerivedValue(() => {
        return animate
            ? mounted.value
                ? withTiming(_height, { duration: 300 })
                : 0
            : _height
    })

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value
    }))
    return (
        <View style={{ alignItems: 'center' }}>
            <Animated.View
                style={[
                    animatedStyle,
                    styles.bar,
                    { backgroundColor: barColor }
                ]}
            />
            <View style={styles.textContainer}>
                <Text
                    numberOfLines={1}
                    style={[styles.labelText, { color: labelColor }]}>
                    {label}
                </Text>
            </View>
        </View>
    )
}

const normalizeValue = function (
    value: number,
    minValue: number,
    maxValue: number,
    defaultValue: number = 1
) {
    if (maxValue - minValue === 0) return defaultValue
    return (value - minValue) / (maxValue - minValue)
}

export type Props = {
    data: DataItem[]
    style?: StyleProp<ViewStyle>
    labelColor?: string
    barColor?: string
    minValue?: number
    maxValue?: number
    maxHeight: number
    minHeight?: number
    normalize?: boolean
    defaultNormValue?: number
    animate?: boolean
    minNormValue?: number
}

const BarChart: FC<Props> = function ({
    data,
    style,
    labelColor = Colors.primary,
    barColor = Colors.secondary,
    minHeight = 0,
    minValue = 0,
    maxValue = 1,
    maxHeight,
    normalize = true,
    // should be between 0 and 1
    defaultNormValue = 0.5,
    minNormValue = undefined,
    animate = true
}) {
    const values = data.map((x) => x.value)
    const [normMinValue, normMaxValue] = [
        minNormValue ?? Math.min(...values),
        Math.max(...values)
    ]
    // Needed to smooth at first and see the animation on mount
    const mounted = useSharedValue<boolean>(false)
    useEffect(() => {
        mounted.value = true
    }, [mounted])

    return (
        <View style={[styles.container, style]}>
            {data.map(({ value, label }, i) => (
                <BarItem
                    key={i}
                    value={
                        normalize
                            ? normalizeValue(
                                  value,
                                  normMinValue,
                                  normMaxValue,
                                  defaultNormValue
                              )
                            : value
                    }
                    {...{
                        label,
                        labelColor,
                        barColor,
                        minHeight,
                        maxHeight,
                        animate
                    }}
                    minValue={normalize ? 0 : minValue}
                    maxValue={normalize ? 1 : maxValue}
                    mounted={mounted}
                />
            ))}
        </View>
    )
}

export { BarChart }
