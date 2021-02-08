
import { Button } from '@src/components'
import { CARD_HEIGHT, CARD_WIDTH } from '@src/components/Card'
import { useTopBarBtnPress, useTopBarHeight, useUniqueID } from '@src/hooks'
import { Colors } from '@src/theme'
import React, { useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { CardItem } from './CardItem'
import { DefaultItem, DraggableList, RenderProps } from './DraggableList'
import styles from './styles'

type Card = DefaultItem & {
    id: string
    color: string
}
const CARDS: Card[] = [
    {
        id: 'item-0',
        color: Colors.primary,
    },
    {
        id: 'item-1',
        color: Colors.secondary
    }
]

export type Props = {}

const DraggableListScreen: RNNFC<Props> = function ({ componentId }) {

    const {  height } = useWindowDimensions()

    const [cards, setCards] = useState<Card[]>(CARDS)

    const [verticalOnly, setVerticalOnly] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)

    const { getID } = useUniqueID(CARDS.length)
    const topbarHeight = useTopBarHeight()

    useTopBarBtnPress(componentId, (event) => {
        if (event.buttonId === 'add') {
            setCards((old) => [
                ...old,
                { color: Colors.primary, id: getID('item-') }
            ])
        }
    })

    function onDelete(itemID: string | number) {
        setCards((old) => [...old.filter((x) => x.id !== itemID)])
    }

    function _renderItem({ data, item }: RenderProps<Card>) {
        return (
            <CardItem
                data={data}
                item={item}
                onDelete={() => onDelete(data.id)}
            />
        )
    }

    return (
        <View style={{ flex: 1 }}>

            <DraggableList
                data={cards}
                renderItem={_renderItem}
                keyExtractor={(x) => x.id}
                config={{
                    spacingY: 30,
                    spacingEnd: 0,
                    defaultItemHeight: CARD_HEIGHT,
                    defaultItemWidth: CARD_WIDTH,
                    verticalOnly: verticalOnly,
                    disabled: disabled,
                    minHeight: height - topbarHeight
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
                id: 'add',
                color: Colors.primary,
                icon: require('@img/icons/plus-20.png')
            }
        ]
    }
}

export { DraggableListScreen }
