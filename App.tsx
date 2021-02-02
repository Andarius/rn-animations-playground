import React, { FC } from 'react'
import { NavigationFunctionComponent as RNFC } from 'react-native-navigation'
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
} from 'react-native'

import { RectButton } from 'react-native-gesture-handler'
import { Navigation } from 'react-native-navigation'

import { Colors } from '@src/index'

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.background
    },
    goToBtn: {
        alignSelf: 'stretch',
        backgroundColor: Colors.white,
        height: 70,
        justifyContent: 'center'
    },
    text: {
        paddingLeft: 10
    },
    headerContainer: {
        backgroundColor: Colors.primary
    },
    headerText: {
        color: Colors.white,
        marginLeft: 10,
        fontSize: 18,
        marginVertical: 3
    }
})

const SCREENS = [
    {
        title: 'Reanimated utils'
    },
    {
        name: 'WorkletScreen',
        title: 'Worklets'
    },
    {
        name: 'Worklet2Screen',
        title: 'Worklets 2'
    },
    {
        name: 'GestureScreen',
        title: 'Gesture'
    },
    {
        name: 'DragToSortScreen',
        title: ' Drag to Sort'
    },
    {
        title: 'Animations'
    },
    // {
    //     name: 'DraggableListScreen',
    //     title: 'Draggable List'
    // },
    {
        name: 'GalleryScreen',
        title: 'Images Gallery'
    },
    {
        name: 'BarChartScreen',
        title: 'BarChart'
    },
    {
        name: 'CalendarScreen',
        title: 'Calendar'
    },
    {
        name: 'PaginateScreen',
        title: 'Paginate'
    },
    {
        name: 'SeletectableListScreen',
        title: 'Selectable List'
    },
    {
        name: 'TopbarMenuScreen',
        title: 'Topbar Menu'
    }, 
    {
        name: 'ViewPagerHeaderScreen',
        title: 'ViewPager Header'
    }
    // {
    //     name: 'DynamicItemsScreen',
    //     title: 'Dynamic Items'
    // }
]

type Props = {}

const App: RNFC<Props> = function ({ componentId }) {

    function goToScreen(screen: string) {
        Navigation.push(componentId, {
            component: {
                name: screen
            }
        })
    }

    return (
        <>
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}
                    >
                    {SCREENS.map((x) => {
                        if (x.name)
                            return (
                                <RectButton
                                    key={x.title}
                                    style={styles.goToBtn}
                                    onPress={() => goToScreen(x.name)}>
                                    <Text style={styles.text}>{x.title}</Text>
                                </RectButton>
                            )
                        else
                            return (
                                <View
                                    style={styles.headerContainer}
                                    key={x.title}>
                                    <Text style={styles.headerText}>
                                        {x.title}
                                    </Text>
                                </View>
                            )
                    })}
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

App.options = {
    topBar: {
        title: {
            text: 'RN Animations',
            alignment: 'center'
        },
        backButton: { visible: false }
    }
}

export default App
