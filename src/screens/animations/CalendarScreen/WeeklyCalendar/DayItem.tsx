import { RectBtnRadius } from '@src/components'
import React, { FC } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native'

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
        color: 'white'
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
        backgroundColor: 'white'
    },
    dayOfMonthText: {
        fontSize: 16,
        color: 'white'
    },
    // Dots
    dotsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        top: 5,
        left: 0,
        right: 0,
        justifyContent: 'center'
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 20,
        marginHorizontal: 1
    },
    otherMonth: {
        opacity: 0.5
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
    isCurrentMonth: boolean
}

const DayItem: FC<Props> = function ({
    date,
    onPress,
    isCurrent = false,
    selectedColor,
    dots,
    titleStyle,
    textStyle,
    isCurrentMonth
}) {
    const dayOfWeek = date.getDay()
    const dayOfMonth = date.getDate()

    const _dots = dots.slice(0, 4)

    return (
        <View style={styles.container}>
            <View style={styles.dayOfWeek}>
                <Text style={[styles.dayOfWeekText, titleStyle]}>
                    {LOCALES.fr.dayNamesShort[dayOfWeek]}
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
                <Text style={[styles.dayOfMonthText, !isCurrentMonth && styles.otherMonth, textStyle]}>
                    {dayOfMonth}
                </Text>
            </RectBtnRadius>
        </View>
    )
}

export { DayItem }
