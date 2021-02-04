import { Colors } from '@src/theme'
import React, { FC } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'
import { RectButton, RectButtonProperties } from 'react-native-gesture-handler'

const styles = StyleSheet.create({
    container: {
        height: 80,
        width: 200,
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelText: {
        fontSize: 20,
        color: Colors.white
    }
})

export type Props = RectButtonProperties & {
    label: string
    style?: StyleProp<ViewStyle>
    labelStyle?:  StyleProp<TextStyle>
}

const Button: FC<Props> = function (props) {
    const { label, style, labelStyle, ...rest } = props
    return (
        <RectButton style={[styles.container, style]} {...rest}>
            <Text style={[styles.labelText, labelStyle]}> { label }</Text>
        </RectButton>
    )
}

export { Button }
