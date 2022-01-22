import { Colors } from '@src/index'
import React from 'react'
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import {
    Navigation,
    NavigationFunctionComponent as RNFC
} from 'react-native-navigation'

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
    {
        name: 'DraggableListScreen',
        title: 'Draggable List'
    },
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
    },
    {
        name: 'LineGraphScreen',
        title: 'Line Graph'
    },
    {
        name: 'ZoomableLineChartScreen',
        title: 'Zoomable Linechart'
    },
    {
        name: 'ModalDemoScreen',
        title: 'Modal Demo'
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
                    style={styles.scrollView}>
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
            alignment: Platform.select({ ios: 'center', android: undefined })
        },
        backButton: { visible: false }
    }
}

export default App
