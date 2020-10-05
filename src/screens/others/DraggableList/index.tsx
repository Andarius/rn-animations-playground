import React, { useState } from 'react'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { View, Text, StyleSheet } from 'react-native'
import { DraggableList, Config } from './DraggableList'
import { CARD_HEIGHT, CARD_WIDTH } from '@src/components/Card'
import { Colors } from '@src/theme'
import Animated from 'react-native-reanimated'
import { RectButton } from 'react-native-gesture-handler'
import { CardItem } from './CardItem'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    btnsContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        width: 100,
        height: 50,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {}
})

type CardType = {
    id: string
    color: string
}

const DATA: CardType[] = [
    {
        id: 'item-1',
        color: Colors.primary
    },
    {
        id: 'item-2',
        color: Colors.secondary
    },
    {
        id: 'item-3',
        color: Colors.tertiary
    }
]

export type Props = {}

const DraggableListScreen: RNNFC<Props> = function ({}) {
    const [items, setItems] = useState<CardType[]>(DATA)

    function onPressAdd() {
        setItems((old) => [
            ...old,
            { color: Colors.primary, id: `ìtem-${old.length}` }
        ])
    }

    function onDelete(itemId: string) {
        setItems((old) => [...old.filter((x) => x.id !== itemId)])
    }

    function _renderItem(data: CardType) {
        return <CardItem data={data} onDelete={() => onDelete(data.id)} />
    }

    return (
        <View style={{ flex: 1 }}>
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
            <View style={styles.btnsContainer}>
                <RectButton onPress={onPressAdd} style={styles.btn}>
                    <Text style={styles.btnText}>Add Item</Text>
                </RectButton>
            </View>
        </View>
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
