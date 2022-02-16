import { Button } from '@src/components'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import {
    Navigation,
    NavigationFunctionComponent as RNNFC
} from 'react-native-navigation'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        height: 40,
        width: 110
    },
    labelText: { fontSize: 14, textAlign: 'center' }
})

export type Props = {}

const ModalDemoScreen: RNNFC<Props> = function ({}) {
    const onModalPress = () => {
        Navigation.showModal({
            component: {
                name: 'ModalScreen',
                passProps: {
                    autoFocus: false
                }
            }
        })
    }

    const onAutofocusModalPress = () => {
        Navigation.showModal({
            component: {
                name: 'ModalScreen',
                passProps: {
                    autoFocus: true
                }
            }
        })
    }

    return (
        <View style={styles.container}>
            <Button
                onPress={onModalPress}
                label="Show Modal"
                style={styles.btn}
                labelStyle={styles.labelText}
            />
            <Button
                onPress={onAutofocusModalPress}
                label="Show Modal Autofocus"
                style={[styles.btn, { marginTop: 10 }]}
                labelStyle={styles.labelText}
            />
        </View>
    )
}

ModalDemoScreen.options = {
    topBar: {
        title: {
            text: 'Modal Demo Screen'
        },
        backButton: {
            visible: true
        }
    }
}

export { ModalDemoScreen }
