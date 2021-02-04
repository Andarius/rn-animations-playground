import { useTopBarBtnPress } from '@src/hooks'
import { Colors } from '@src/theme'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
    Navigation,
    NavigationFunctionComponent as RNNFC
} from 'react-native-navigation'
import { Props as MenuProps } from './ShowMore'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export type Props = {}

const TopbarMenuScreen: RNNFC<Props> = function ({ componentId }) {
    const [btnPressed, setBtnPressed] = useState<number | undefined>(undefined)

    useTopBarBtnPress(componentId, ({ buttonId }) => {
        if (buttonId === 'more-btn') {
            Navigation.showOverlay({
                component: {
                    name: 'ShowMore',
                    passProps: {
                        btns: [
                            {
                                icon: require('@img/icons/plus-20.png'),
                                onPress: () => setBtnPressed(1),
                                text: 'Button 1'
                            },
                            {
                                icon: require('@img/icons/plus-20.png'),
                                onPress: () => setBtnPressed(2),
                                text: 'Button 2'
                            },
                            {
                                icon: require('@img/icons/plus-20.png'),
                                onPress: () => setBtnPressed(3),
                                text: 'Button 3'
                            }
                        ]
                    } as MenuProps
                }
            })
        }
    })

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, color: Colors.primary }}>
                {btnPressed !== undefined
                    ? `Pressed button ${btnPressed}`
                    : 'No button pressed'}
            </Text>
        </View>
    )
}

TopbarMenuScreen.options = {
    topBar: {
        title: {
            text: 'Topbar Menu'
        },
        rightButtons: [
            {
                id: 'more-btn',
                color: Colors.primary,
                icon: require('@img/icons/more_vertical-20.png')
            }
        ]
    }
}

export { TopbarMenuScreen }
