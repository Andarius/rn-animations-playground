import React, { FC } from 'react'
import { Text, StyleSheet } from 'react-native'
import { RectButton, RectButtonProperties } from 'react-native-gesture-handler'
import { Colors } from '@src/theme'

const styles = StyleSheet.create({
    container: {
        height: 80,
        width: 200,
        backgroundColor: Colors.primary,
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
}

const Button: FC<Props> = function (props) {
    const { label, ...rest } = props
    return (
        <RectButton style={styles.container} {...rest}>
            <Text style={styles.labelText}> { label }</Text>
        </RectButton>
    )
}

export { Button }