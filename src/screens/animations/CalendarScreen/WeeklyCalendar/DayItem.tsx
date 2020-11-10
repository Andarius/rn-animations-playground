import React, { FC } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ViewProps,
    TextStyle,
    StyleProp
} from 'react-native'
import { Colors } from '@src/theme'

import { RectBtnRadius } from '@src/components'

const LOCALES = require('./locales.json')

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center'
    },
    dayOfWeek: {
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dayOfWeekText: {
        color: Colors.white
    },
    dayOfMonth: {
        height: 40,
        width: 40,
        marginTop: 5,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    selectedDayOfMonth: {
        backgroundColor: Colors.secondary
    },
    dayOfMonthText: {
        fontSize: 16,
        color: Colors.white
    },
    // Dots
    dotsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        top: 3,
        left: 0,
        right: 0,
        justifyContent: 'center'
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 20,
        marginHorizontal: 1
    }
})

type DotProps = {
    color: string
}
const Dot: FC<DotProps> = function ({ color }) {
    return <View style={[styles.dot, { backgroundColor: color }]} />
}

export type Dot = { color: string }

export type Props = {
    date: Date
    isCurrent: boolean
    onPress: () => void
    selectedColor?: string
    dots: Dot[]
    titleStyle?: StyleProp<TextStyle>
    textStyle?: StyleProp<TextStyle>
}

const DayItem: FC<Props> = function ({
    date,
    onPress,
    isCurrent = false,
    selectedColor,
    dots,
    titleStyle, 
    textStyle
}) {
    const dayOfWeek = date.getDay()
    const dayOfMonth = date.getDate()

    const _dots = dots.slice(0, 4)

    return (
        <View style={styles.container}>
            <View style={styles.dayOfWeek}>
                <Text style={[styles.dayOfWeekText, titleStyle]}>
                    {LOCALES['fr'].dayNamesShort[dayOfWeek]}
                </Text>
            </View>
            <RectBtnRadius
                style={[
                    styles.dayOfMonth,
                    isCurrent &&
                        (selectedColor
                            ? { backgroundColor: selectedColor }
                            : styles.selectedDayOfMonth)
                ]}
                onPress={onPress}>
                <View style={styles.dotsContainer}>
                    {_dots.map((x, i) => (
                        <Dot key={i} color={x.color} />
                    ))}
                </View>
                <Text style={[styles.dayOfMonthText, textStyle]}>{dayOfMonth}</Text>
            </RectBtnRadius>
        </View>
    )
}

export { DayItem }
