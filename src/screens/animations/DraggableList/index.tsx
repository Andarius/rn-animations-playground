import React, { useState } from 'react'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { View } from 'react-native'
import { DraggableList } from './DraggableList'
import { CARD_HEIGHT, CARD_WIDTH } from '@src/components/Card'
import { Colors } from '@src/theme'
import { CardType, CardItem } from './CardItem'
import { useUniqueID } from '@src/utils'
import { useTopBarBtnPress } from '@src/hooks'


const DATA: CardType[] = [
    {
        id: 'item-0',
        color: Colors.primary
    }
    // {
    //     id: 'item-1',
    //     color: Colors.secondary
    // },
    // {
    //     id: 'item-2',
    //     color: Colors.tertiary
    // }
]

export type Props = {}

const DraggableListScreen: RNNFC<Props> = function ({ componentId }) {
    const [items, setItems] = useState<CardType[]>(DATA)

    const { getID } = useUniqueID(DATA.length)

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
        return <CardItem data={data} onDelete={() => onDelete(data.id)} />
    }

    useTopBarBtnPress(componentId, (event) => {
        if (event.buttonId === 'addBtn') {
            onPressAdd()
        }
    })

    return (
        <View style={{ flex: 1 }}>
            <DraggableList
                style={{ marginTop: 20 }}
                data={items}
                renderItem={_renderItem}
                config={{
                    spacingY: 30,
                    spacingEnd: 100,
                    itemHeight: CARD_HEIGHT,
                    itemWidth: CARD_WIDTH,
                    verticalOnly: false
                }}
            />
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
                icon: require('@img/plus-20.png')
            }
        ]
    }
}

export { DraggableListScreen }
