import React, { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors } from '@src/theme'

export const CARD_WIDTH = 300
export const CARD_HEIGH = 150

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: CARD_HEIGH,
        borderRadius: 20,
        backgroundColor: Colors.primary
    }
})

export type Props = { }

const Card: FC<Props> = function ({ children }) {
    return (
        <View style={styles.container}>
            { children }
        </View>
    )
}

export { Card }