import React, { FC, useContext } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { AnimatedCard } from '@src/components'

import { Colors } from '@src/theme'
import Animated, { useSharedValue } from 'react-native-reanimated'
import { DragListContext } from './DraggableList/utils'

type CardType = {
    id: string
    color: string
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    btn: {
        height: 20,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnsContainer: {
        marginLeft: 10,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    btnText: {
        fontSize: 20,
        color: Colors.white
    }
})

export type Props = {
    data: CardType
    onDelete: () => void
}

const CardItem: FC<Props> = function ({ data, onDelete }) {
    
    // const height = useSharedValue(0)
    const items = useContext(DragListContext)
    const item = items.get(data.id)
    if(item === undefined)
        console.log('Item cannot be empty')
    console.log('item : ', item)
    const { height } = item ?? {}
    return (
        // <AnimatedCard height={height} style={{ backgroundColor: data.color }}>
            <View style={styles.btnsContainer}>
                <BorderlessButton
                    onPress={() => (height.value = height.value + 50)}
                    style={styles.btn}>
                    <Text style={styles.btnText}>+</Text>
                </BorderlessButton>
                <BorderlessButton
                    onPress={() => (height.value = height.value - 50)}
                    style={styles.btn}>
                    <Text style={styles.btnText}>-</Text>
                </BorderlessButton>
                <BorderlessButton onPress={onDelete} style={styles.btn}>
                    <Text style={styles.btnText}>x</Text>
                </BorderlessButton>
            </View>
        // </AnimatedCard>
    )
}

export { CardItem }
