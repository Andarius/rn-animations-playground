import React, { FC } from 'react'
import { View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export type Props = { }

const ModalScreen: FC<Props> = function ({}) {
    return (
        <View style={styles.container}>

        </View>
    )
}

export { ModalScreen }
