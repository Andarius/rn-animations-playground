import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export type Props = {}

const ModalBottomContainer: FC<Props> = function ({}) {
    return <View style={styles.container}></View>
}

export { ModalBottomContainer }
