import { Colors } from '@src/theme'
import React, { FC, useEffect } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { HorizontalBarItem, VerticalBarItem } from './BarItem'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    containerVertical: {
        alignItems: 'flex-end',
        flexDirection: 'row'
    },
    containerHorizontal: {
        alignItems: 'flex-start'
    }
})

export type DataItem = {
    value: number
    label: string
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
    horizontal?: boolean
}

const Barchart: FC<Props> = function ({
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
    animate = true,
    horizontal = false
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
        <View
            style={[
                styles.container,
                horizontal
                    ? styles.containerHorizontal
                    : styles.containerVertical,
                style
            ]}>
            {data.map(({ value, label }, i) =>
                horizontal ? (
                    <HorizontalBarItem
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
                            animate,
                            horizontal
                        }}
                        minValue={normalize ? 0 : minValue}
                        maxValue={normalize ? 1 : maxValue}
                        mounted={mounted}
                    />
                ) : (
                    <VerticalBarItem
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
                            animate,
                            horizontal
                        }}
                        minValue={normalize ? 0 : minValue}
                        maxValue={normalize ? 1 : maxValue}
                        mounted={mounted}
                    />
                )
            )}
        </View>
    )
}

export { Barchart }
