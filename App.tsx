import React, { FC } from 'react'
import { NavigationFunctionComponent as RNFC } from 'react-native-navigation'
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar, useWindowDimensions
} from 'react-native'

import { RectButton } from 'react-native-gesture-handler'
import { Navigation } from 'react-native-navigation'

import { Colors } from '@src/index'


const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.background,
    },
    goToBtn: {
        width: 250,
        backgroundColor: Colors.white,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }
})

type Props = {}

const App: RNFC<Props> = function({ componentId }){

    const { height } = useWindowDimensions()

    function goToScreen(screen: string){
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
                    contentContainerStyle={{ alignItems: 'center', height}}>
                    <View style={{marginTop: 200 }}/>
                    <RectButton 
                        style={styles.goToBtn}
                        onPress={() => goToScreen('FirstScreen')}>
                        <Text> First Screen </Text>
                    </RectButton>

                </ScrollView>
            </SafeAreaView>
        </>
    )
}


export default App
