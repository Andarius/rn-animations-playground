import React, { FC } from 'react'
import { View, StyleSheet, useWindowDimensions, Text } from 'react-native'
import { Colors } from '@src/theme'
import { Offset } from './Pager'

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export type Props = {
    offsets: Offset[]
}

const OffsetsInfo: FC<Props> = function ({ offsets }) {
    const { width } = useWindowDimensions()
    return (
        <View style={{ flexDirection: 'row' }}>
        {offsets.map((offset, i) => (
            <View key={i} style={{ width: width / offsets.length }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: Colors.primary }}>
                        offset.x
                    </Text>
                    <Text
                        style={{ color: Colors.primary, fontSize: 16 }}>
                        {Math.round(offset.x.value)}
                    </Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: Colors.primary }}>
                        offset.translateX
                    </Text>
                    <Text
                        style={{ color: Colors.primary, fontSize: 16 }}>
                        {Math.round(offset.translateX.value)}
                    </Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: Colors.primary }}>
                        offset.position
                    </Text>
                    <Text
                        style={{ color: Colors.primary, fontSize: 16 }}>
                        {offset.position.value}
                    </Text>
                </View>
            </View>
        ))}
    </View>
    )
}

export { OffsetsInfo }