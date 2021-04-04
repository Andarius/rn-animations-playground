import { Colors } from '@src/theme'
import React from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { LineGraph, LineItem } from './LineGraph'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export type Props = {
    lines: LineItem[]
}

const GraphModal: RNNFC<Props> = function ({ lines }) {
    const { width, height } = useWindowDimensions()
    return (
        <View style={styles.container}>
            <LineGraph
                lines={lines}
                height={height - 70}
                width={width - 70}
                containerStyle={{
                    borderWidth: 2,
                    borderColor: Colors.secondary
                }}
            />
        </View>
    )
}

export { GraphModal }
