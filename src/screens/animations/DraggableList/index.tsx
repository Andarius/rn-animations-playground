import React, { useState } from 'react'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { View, Text, StyleSheet } from 'react-native'
import { DraggableList } from './DraggableList'
import { CARD_HEIGHT, CARD_WIDTH } from '@src/components/Card'
import { Colors } from '@src/theme'
import { CardType, CardItem, CardItemMemo } from './CardItem'
import { useUniqueID } from '@src/hooks'
import { useTopBarBtnPress } from '@src/hooks'
import { Button } from '@src/components'
import styles from './styles'

const DATA: CardType[] = [...Array(10).keys()].map((x) => ({
        id: `item-${x}`,
        color: Colors.primary,
        height: 100
}))
    // {
    //     id: 'item-0',
    //     color: Colors.primary,
    //     height: 100
    // },
    // {
    //     id: 'item-1',
    //     color: Colors.secondary,
    //     height: 200
    // },
    // {
    //     id: 'item-2',
    //     color: Colors.secondary,
    //     height: 100
    // },
    // {
    //     id: 'item-4',
    //     color: Colors.secondary,
    //     height: 100
    // }



export type Props = {}

const DraggableListScreen: RNNFC<Props> = function ({ componentId }) {
    const [items, setItems] = useState<CardType[]>(DATA)

    const { getID } = useUniqueID(DATA.length + 1)

    const [verticalOnly, setVerticalOnly] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)

    function onPressAdd() {
        setItems((old) => [
            ...old,
            { color: Colors.primary, id: getID('item-') }
        ])
    }

    function onDelete(itemId: string) {
        setItems((old) => [...old.filter((x) => x.id !== itemId)])
    }

    function _renderItem(data: CardType) {        
        return (
            <CardItemMemo data={data} onDelete={() => onDelete(data.id)}/>
        )
    }

    useTopBarBtnPress(componentId, (event) => {
        if (event.buttonId === 'addBtn') {
            onPressAdd()
        }
    })

    return (
        <View style={{ flex: 1 }}>
            <DraggableList
                style={{ paddingTop: 20 }}
                data={items}
                renderItem={_renderItem}
                config={{
                    spacingY: 30,
                    spacingEnd: 300,
                    itemHeight: CARD_HEIGHT,
                    itemWidth: CARD_WIDTH,
                    verticalOnly: verticalOnly,
                    disabled: disabled
                }}
            />

            <View style={styles.btnsContainer}>
                <Button style={styles.btn}
                    labelStyle={styles.labelText}
                    label={verticalOnly ? 'X/Y axis' : 'Y axis only'}
                    onPress={() => setVerticalOnly((old) => !old)}
                />

                <Button style={styles.btn}
                    labelStyle={styles.labelText}
                    label={disabled ? 'Enable' : 'Disable'}
                    onPress={() => setDisabled((old) => !old)}
                />
            </View>
        </View>
    )
}

DraggableListScreen.options = {
    topBar: {
        title: {
            text: 'Draggable List'
        },
        rightButtons: [
            {
                id: 'addBtn',
                color: Colors.primary,
                icon: require('@img/icons/plus-20.png')
            }
        ]
    }
}

export { DraggableListScreen }
