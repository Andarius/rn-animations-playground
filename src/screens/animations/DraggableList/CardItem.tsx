import React, { FC, useContext, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { AnimatedCard, ReText } from '@src/components'

import { Colors } from '@src/theme'
import { useDraggableItem } from './DraggableList'
import {
    useAnimatedReaction,
    useDerivedValue,
    //@ts-expect-error
    runOnJS
} from 'react-native-reanimated'

export type CardType = {
    id: string
    color: string
    height?: number
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

const CardItem: FC<Props> = function ({ data, onDelete, children }) {
    // const height = useSharedValue(0)
    const { item, removeItem } = useDraggableItem(data.id)
    const [position, setPosition] = useState<number>(-1)

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

    const _ = useDerivedValue(() => {
        if(item && item.position.value !== position)
            runOnJS(setPosition)(item.position.value)
        return 0
    }, [position, item])

    if (!item) return <View></View>
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
                {children}
            </AnimatedCard>
        )
    }
}

export { CardItem }
