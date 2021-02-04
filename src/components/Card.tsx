import { Colors } from '@src/theme'
import React, { FC } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export const CARD_WIDTH = 330
export const CARD_HEIGHT = 170

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 20,
        backgroundColor: Colors.primary
    }
})

export type Props = {
    style?: StyleProp<ViewStyle>
 }

const Card: FC<Props> = function ({ children, style }) {
    return (
        <View style={[styles.container, style]}>
            { children }
        </View>
    )
}

export { Card }
