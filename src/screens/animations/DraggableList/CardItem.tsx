import { AnimatedCard } from '@src/components'
import { Colors } from '@src/theme'
import React, { FC, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated'
import { IDraggableItem } from './DraggableList/utils'


export type CardType = {
    id: number | string
    color: string
    height?: number
}

const styles = StyleSheet.create({
    btn: {
        height: 20,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnsContainer: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
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
} & { item: IDraggableItem }

const CardItem: FC<Props> = function ({ data, onDelete, item }) {

    const [position, setPosition] = useState<number>(0)


    const { height } = item

    useAnimatedReaction(
        () => item.position.value,
        (_position, prevPosition) => {
            if (_position !== prevPosition)
                runOnJS(setPosition)(_position)
        },
        [item])


    return (
        <AnimatedCard
            height={height}
            style={{
                backgroundColor: data.color,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <View style={{ position: 'absolute', top: 5, right: 10 }}>
                {/* <ReText text={position} /> */}
                <Text style={{ color: Colors.white }}>{position}</Text>
            </View>
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
            <Text style={{ color: Colors.white, fontSize: 18 }}>
                {data.id}
            </Text>
        </AnimatedCard>
    )
}

export { CardItem }
