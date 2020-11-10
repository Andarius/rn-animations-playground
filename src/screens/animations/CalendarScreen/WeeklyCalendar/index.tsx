import { Colors } from '@src/theme'
import React, { FC, useEffect, useRef, useState } from 'react'
import {
    StyleProp,
    StyleSheet,
    TextStyle,
    useWindowDimensions,
    View,
    ViewStyle
} from 'react-native'
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent
} from 'react-native-gesture-handler'
import Animated, {
    //@ts-expect-error
    makeMutable,
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler
} from 'react-native-reanimated'
import { DayItem, Dot } from './DayItem'
import { Offset, Pager, SwipeDirection } from './Pager'
import { getNextWeek, getPreviousWeek, getWeekDays, getDate } from './utils'

export type { Dot }

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
}

const WeeklyCalendar: FC<Props> = function ({
    currentDate,
    onDateChanged,
    backgroundColor,
    selectedColor,
    markedDates,
    titleStyle,
    textStyle
}) {
    const [_currentDate, setCurrentDate] = useState(currentDate)

    const currentWeek = getWeekDays(_currentDate)
    const prevWeek = getPreviousWeek(_currentDate)
    const nextWeek = getNextWeek(_currentDate)

    useEffect(() => {
        onDateChanged(_currentDate)
    }, [_currentDate])

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
        if (direction === 'left') setCurrentDate(prevWeek[0])
        else setCurrentDate(nextWeek[0])

        offsets.map((offset, i) => {
            offset.x.value = i === 0 ? -width : i === 1 ? 0 : width
            offset.tmpX.value = 0
            offset.translateX.value = 0
        })
    }
    const weeklyHeight = useSharedValue(80)

    return (
        <>
            {weeks.map((week, i) => (
                <Pager
                    height={weeklyHeight}
                    index={i}
                    onDoneMoving={onDoneMoving}
                    key={`${i}-${getDate(week[0])}`}
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
                        {week.map((x) => {
                            const _date = getDate(x)
                            return (
                                <DayItem
                                    {...{ selectedColor, titleStyle, textStyle }}
                                    dots={markedDates?.get(_date) ?? []}
                                    key={getDate(x)}
                                    date={x}
                                    onPress={() => setCurrentDate(x)}
                                    isCurrent={
                                        getDate(x) === getDate(_currentDate)
                                    }
                                />
                            )
                        })}
                    </View>
                </Pager>
            ))}
        </>
    )
}

export { WeeklyCalendar }
