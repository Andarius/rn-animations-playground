import React, { FC, useEffect, useRef, useState } from 'react'
import {
    StyleProp,
    StyleSheet,
    TextStyle,
    useWindowDimensions,
    View
} from 'react-native'
import Animated, {
    //@ts-expect-error
    makeMutable,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated'
import { DayItem, Dot } from './DayItem'
import { Offset, Pager, SwipeDirection } from './Pager'
import { getNextWeek, getPreviousWeek } from './utils'
import { getDate, getWeekDays } from './utils'
import { useEffectSkipFirst } from '@src/hooks'

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
    const [_currentDate, setCurrentDate] = useState(currentDate)
    const currentMonth = _currentDate.getMonth()
    const currentWeek = getWeekDays(_currentDate)
    const prevWeek = getPreviousWeek(_currentDate)
    const nextWeek = getNextWeek(_currentDate)

    useEffect(() => {
        onDateChanged(_currentDate)
    }, [_currentDate])

    useEffectSkipFirst(() => {
        setCurrentDate(currentDate)
    }, [currentDate])

    const weeks = [prevWeek, currentWeek, nextWeek]

    const { width } = useWindowDimensions()
    const isMoving = useSharedValue<boolean>(false)
    const offsets = useRef<Offset[]>([
        {
            x: makeMutable(-width),
            tmpX: makeMutable(0),
            translateX: makeMutable(0)
        },
        {
            x: makeMutable(0),
            tmpX: makeMutable(0),
            translateX: makeMutable(0)
        },
        {
            x: makeMutable(width),
            tmpX: makeMutable(0),
            translateX: makeMutable(0)
        }
    ]).current

    function onDoneMoving(direction: SwipeDirection) {
        const newDate = direction === 'left' ? prevWeek[0]: nextWeek[0] 
        setCurrentDate(newDate)

        offsets.map((offset, i) => {
            offset.x.value = i === 0 ? -width : i === 1 ? 0 : width
            offset.tmpX.value = 0
            offset.translateX.value = 0
        })
    }

    const weeklyHeight = useSharedValue(80)

    const style = useAnimatedStyle(() => ({
        height: weeklyHeight.value
    }))

    return (
        <Animated.View style={[style]}>
            {weeks.map((week, i) => (
                <Pager
                    height={weeklyHeight}
                    index={i}
                    onDoneMoving={onDoneMoving}
                    key={`week-${i}`}
                    {...{ isMoving }}
                    offset={offsets[i]}
                    prevOffset={i === 0 ? undefined : offsets[i - 1]}
                    nextOffset={
                        i === offsets.length - 1 ? undefined : offsets[i + 1]
                    }>
                    <View
                        style={[styles.header, { backgroundColor }]}
                        onLayout={({ nativeEvent }) => {
                            weeklyHeight.value = nativeEvent.layout.height
                        }}>
                        {week.map((x, j) => {
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
                                        if(onPressDate) onPressDate(x)
                                    }}
                                    isCurrent={
                                        getDate(x) === getDate(_currentDate)
                                    }
                                />
                            )
                        })}
                    </View>
                </Pager>
            ))}
        </Animated.View>
    )
}


