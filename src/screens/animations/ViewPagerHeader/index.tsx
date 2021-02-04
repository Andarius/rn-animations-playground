import { Colors } from '@src/theme'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
    NavigationFunctionComponent as RNNFC
} from 'react-native-navigation'
import { Item, ViewPagerHeader } from './ViewPagerHeader'


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center'
    }
})

export type Props = {}

const ViewPagerHeaderScreen: RNNFC<Props> = function ({  }) {
    const [currentTab, setCurrentTab] = useState<number>(0)
    const headers: Item<number>[] = [
        {
            data: 0,
            text: 'Fist Tab'
        },
        {
            data: 1,
            text: 'Second Tab'
        },
        {
            data: 2,
            text: 'Third Tab'
        }
    ]

    return (
        <View style={styles.container}>
            <View style={{ height: 60, backgroundColor: Colors.primary }}>
                <ViewPagerHeader
                    currentValue={currentTab}
                    btnHeight={60}
                    items={headers}
                    onPress={setCurrentTab}
                />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, color: Colors.secondary }}>{`Current tab: ${currentTab}`}</Text>
            </View>
        </View>
    )
}

ViewPagerHeaderScreen.options = {
    topBar: {
        title: {
            text: 'ViewPager Header Menu'
        }
    }
}

export { ViewPagerHeaderScreen }
