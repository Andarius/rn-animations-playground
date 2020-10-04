import React, { useState } from 'react'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { View, Text, StyleSheet } from 'react-native'
import { DraggableList, Config } from './DraggableList'
import { Card, CARD_HEIGHT, CARD_WIDTH } from '@src/components/Card'
import { Colors } from '@src/theme'
import Animated, { useSharedValue } from 'react-native-reanimated'
import { config } from 'process'
import { BorderlessButton, RectButton } from 'react-native-gesture-handler'
import { AnimatedCard } from '@src/components'

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
        marginTop: 10
    },
    btnText: {
        fontSize: 20,
        color: Colors.white
    }
})

type CardType = {
    color: string
}

const DATA: CardType[] = [
    {
        color: Colors.primary
    },
    {
        color: Colors.secondary
    },
    {
        color: Colors.tertiary
    }
]

export type Props = {}

const DraggableListScreen: RNNFC<Props> = function ({}) {
    const [items, setItems] = useState<CardType[]>(DATA)

    function _renderItem(
        data: CardType,
        { height }: { height: Animated.SharedValue<number> }
    ) {
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
                </View>
            </AnimatedCard>
        )
    }

    return (
        <DraggableList
            data={items}
            renderItem={_renderItem}
            config={{
                spacingY: 30,
                spacingEnd: 100,
                height: CARD_HEIGHT,
                width: CARD_WIDTH,
                verticalOnly: true
            }}
        />
    )
}

DraggableListScreen.options = {
    topBar: {
        title: {
            text: 'Draggable List'
        }
    }
}

export { DraggableListScreen }
