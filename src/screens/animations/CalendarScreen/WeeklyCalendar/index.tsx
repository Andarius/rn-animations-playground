import React, { FC, useEffect, useRef, useState } from 'react'
import {
    StyleProp,
    StyleSheet,
    TextStyle,
    useWindowDimensions,
    View
} from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated'
import { DayItem, Dot } from './DayItem'
import { getNextWeek, getPreviousWeek } from './utils'
import { getDate, getWeekDays } from './utils'
import { useEffectSkipFirst } from '@src/hooks'
import {
    Paginate,
    RenderProps,
    Direction
} from '../../PaginateScreen/Paginate'

export type { Dot }
export { WeeklyCalendar }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    header: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
})

export type Props = {
    currentDate: Date
    onDateChanged: (date: Date) => void
    backgroundColor?: string
    selectedColor?: string
    markedDates?: Map<string, Dot[]>
    titleStyle?: StyleProp<TextStyle>
    textStyle?: StyleProp<TextStyle>
    onPressDate?: (date: Date) => void
}

const WeeklyCalendar: FC<Props> = function ({
    currentDate,
    onDateChanged,
    backgroundColor,
    selectedColor,
    markedDates,
    titleStyle,
    textStyle,
    onPressDate
}) {
    
    const { width } = useWindowDimensions()

    const [_currentDate, setCurrentDate] = useState(currentDate)
    const currentMonth = _currentDate.getMonth()
    const currentWeek = getWeekDays(_currentDate)
    const prevWeek = getPreviousWeek(_currentDate)
    const nextWeek = getNextWeek(_currentDate)

    const weeks = [prevWeek, currentWeek, nextWeek]

    useEffect(() => {
        onDateChanged(_currentDate)
    }, [_currentDate])

    useEffectSkipFirst(() => {
        setCurrentDate(currentDate)
    }, [currentDate])

    
    function onDoneMoving(direction: Direction) {
        const newDate = direction === 'right' ? prevWeek[0] : nextWeek[0]
        setCurrentDate(newDate)
    }

    const weeklyHeight = useSharedValue(80)

    const style = useAnimatedStyle(() => ({
        height: weeklyHeight.value
    }))

    function renderItem({ item }: RenderProps<Date[]>) {
        return (
            <View
                style={[styles.header, { backgroundColor, width }]}
                onLayout={({ nativeEvent }) => {
                    weeklyHeight.value = nativeEvent.layout.height
                }}>
                {item.map((x, j) => {
                    const _date = getDate(x)
                    return (
                        <DayItem
                            {...{ selectedColor, titleStyle, textStyle }}
                            isCurrentMonth={x.getMonth() === currentMonth}
                            dots={markedDates?.get(_date) ?? []}
                            key={`day-${j}`}
                            date={x}
                            onPress={() => {
                                setCurrentDate(x)
                                if (onPressDate) onPressDate(x)
                            }}
                            isCurrent={getDate(x) === getDate(_currentDate)}
                        />
                    )
                })}
            </View>
        )
    }

    return (
        <Animated.View style={[style]}>
            <Paginate
                data={weeks}
                itemHeight={weeklyHeight}
                onDoneMoving={onDoneMoving}
                renderItem={renderItem}
            />
        </Animated.View>
    )
}
