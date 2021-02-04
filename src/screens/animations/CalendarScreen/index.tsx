import { Colors } from '@src/theme'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { Dot, WeeklyCalendar } from './WeeklyCalendar'


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    textContainer: {},
    text: {
        color: Colors.secondary,
        fontSize: 20
    }
})

export type Props = {}

const CalendarScreen: RNNFC<Props> = function ({}) {
    const markedDates = new Map<string, Dot[]>([
        ['2020-11-10', [{ color: 'blue' }]],
        ['2020-11-15', [{ color: 'red' }, { color: 'blue' }]]
    ])
    const [currentDate, setCurrentDate] = useState(new Date('2020-11-10'))
    return (
        <View style={styles.container}>
            <WeeklyCalendar
                currentDate={currentDate}
                onDateChanged={setCurrentDate}
                backgroundColor={Colors.primary}
                selectedColor={Colors.secondary}
                markedDates={markedDates}
                // textStyle={{ color: Colors.tertiary}}
                // titleStyle={{ color: Colors.tertiary}}
            />
            <View style={{ flex: 1 }}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        {currentDate.toISOString().split('T')[0]}
                    </Text>
                </View>
            </View>
        </View>
    )
}

CalendarScreen.options = {
    topBar: {
        title: {
            text: 'Calendar'
        }
    }
}

export { CalendarScreen }
