import React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export type Props = {}

const SkiaGradientScreen: RNNFC<Props> = function ({}) {
    return <View style={styles.container}></View>
}

SkiaGradientScreen.options = {
    topBar: {
        title: {
            text: 'Skia gradient'
        }
    }
}

export { SkiaGradientScreen }
