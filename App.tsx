import React, { FC } from 'react'
import { NavigationFunctionComponent as RNFC } from 'react-native-navigation'
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    useWindowDimensions
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
        justifyContent: 'center',
    },
    text: {
        paddingLeft: 10
    }
})

const SCREENS = [
    {
        name: 'WorkletScreen',
        title: 'Lesson 1. Worklets'
    },
    {
        name: 'GestureScreen',
        title: 'Lesson 2. Gesture'
    }
]

type Props = {}

const App: RNFC<Props> = function ({ componentId }) {
    const { height } = useWindowDimensions()

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
                    contentContainerStyle={{ }}>
                    {SCREENS.map((x) => (
                        <RectButton
                            key={x.name}
                            style={styles.goToBtn}
                            onPress={() => goToScreen(x.name)}>
                            <Text style={styles.text}>{x.title}</Text>
                        </RectButton>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

App.options = {
    topBar: {
        title: {
            text: 'RN Animations',
            alignment: 'center',
            color: Colors.primary
        }
    }
}

export default App
