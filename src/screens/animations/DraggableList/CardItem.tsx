import React, { FC, useContext } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { AnimatedCard } from '@src/components'

import { Colors } from '@src/theme'
import { useDraggableItem } from './DraggableList'

export type CardType = {
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
    const { item, removeItem } = useDraggableItem(data.id)

    function _onDelete(){
        removeItem()
        onDelete()
    }

    if (!item) return <View></View>
    else {
        const { height } = item
        return (
            <AnimatedCard
                height={height}
                style={{ backgroundColor: data.color }}>
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
                    <BorderlessButton onPress={_onDelete} style={styles.btn}>
                        <Text style={styles.btnText}>x</Text>
                    </BorderlessButton>
                </View>
            </AnimatedCard>
        )
    }
}

export { CardItem }
