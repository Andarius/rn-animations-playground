import { AnimatedCard } from '@src/components'
import { Colors } from '@src/theme'
import React, { FC, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { useDraggableItem } from './DraggableList'

export type CardType = {
    id: string
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
}

const CardItem: FC<Props> = function ({ data, onDelete }) {
    // const height = useSharedValue(0)
    console.log('render: ', data.id)
    const { item, removeItem } = useDraggableItem(data.id)
    const [position] = useState<number>(-1)
    function _onDelete() {
        removeItem()
        onDelete()
    }


    // useAnimatedReaction(
    //     () => item?.position.value,
    //     (_position: number | undefined) => {
    //         if (_position && position !== _position)
    //             runOnJS(setPosition)(_position)
    //     },
    //     [position, item]
    // )

    // const _ = useDerivedValue(() => {
    //     if (item && item.position.value !== position)
    //         runOnJS(setPosition)(item.position.value)
    //     return 0
    // }, [position, item])

    if (!item) return <View/>
    else {
        const { height } = item
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
                    <BorderlessButton onPress={_onDelete} style={styles.btn}>
                        <Text style={styles.btnText}>x</Text>
                    </BorderlessButton>
                </View>
                <Text style={{ color: Colors.white, fontSize: 18 }}>
                    {data.id}
                </Text>
            </AnimatedCard>
        )
    }
}

const equals = function (_prev: Props, _next: Props) {
    return true //JSON.stringify(prev.data) === JSON.stringify(next.data)
}

const CardItemMemo = React.memo(CardItem, equals)

export { CardItem, CardItemMemo }
