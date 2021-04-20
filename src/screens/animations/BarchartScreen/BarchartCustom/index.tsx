import { normalizeValue } from '@src/utils'
import React, { FC, useEffect } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, { interpolate, useSharedValue } from 'react-native-reanimated'

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

export type RenderBarProps = {
    position: number
    barSize: number
    label: string
    mounted: Animated.SharedValue<boolean>
}

export type Props = {
    data: DataItem[]
    style?: StyleProp<ViewStyle>
    minValue?: number
    maxValue?: number
    maxHeight: number
    minHeight?: number
    normalize?: boolean
    defaultNormValue?: number
    minNormValue?: number
    horizontal?: boolean
    renderBar: (props: RenderBarProps) => React.ReactElement
}

const Barchart: FC<Props> = function ({
    data,
    style,
    minHeight = 0,
    minValue = 0,
    maxValue = 1,
    maxHeight,
    normalize = true,
    // should be between 0 and 1
    defaultNormValue = 0.5,
    minNormValue = undefined,
    horizontal = false,
    renderBar
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
            {data.map(({ value, label }, i) => {
                const _value = normalize
                    ? normalizeValue(
                          value,
                          normMinValue,
                          normMaxValue,
                          defaultNormValue
                      )
                    : value
                const _minValue = normalize ? 0 : minValue
                const _maxValue = normalize ? 1 : maxValue

                const _barSize = interpolate(
                    _value,
                    [_minValue, _maxValue],
                    [minHeight, maxHeight],
                    Animated.Extrapolate.CLAMP
                )

                const _props: RenderBarProps = {
                    position: i,
                    barSize: _barSize,
                    mounted,
                    label
                }
                return (
                    <View
                        key={i}
                        style={[
                            horizontal && {
                                flexDirection: 'row'
                            }
                        ]}>
                        {renderBar(_props)}
                    </View>
                )
            })}
        </View>
    )
}

export { Barchart }
