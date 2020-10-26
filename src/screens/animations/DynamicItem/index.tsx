import React, { FC, useContext, useEffect, useState } from 'react'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import {
    BorderlessButton,
    PanGestureHandler,
    RectButton
} from 'react-native-gesture-handler'

import { useUniqueID } from '@src/hooks'
import { Card } from '@src/components'
import { Colors } from '@src/theme'
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue
} from 'react-native-reanimated'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    btnsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        width: 100,
        height: 40,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: Colors.white
    }
})

export type Props = {}

type AnimatedItem = {
    id: Item['id']    
    offset: Animated.SharedValue<number>
}

type Item = {
    id: string
    color: string
}

const colors = [Colors.primary, Colors.secondary, Colors.tertiary]

type DragListContextProps = {
    items: AnimatedItem[]
    setItems: React.Dispatch<React.SetStateAction<AnimatedItem[]>>
}
const DragListContext = React.createContext<DragListContextProps>({
    items: [],
    setItems: () => {}
})

const useDraggableItem = function (
    itemID: Item['id'],
    offset: Animated.SharedValue<number>
) {
    const { items, setItems } = useContext(DragListContext)

    const item = items.filter((x) => x.id === itemID)[0]

    function updateItem(item: Omit<AnimatedItem, 'id'>) {
        console.log('adding: ', itemID)
        setItems((old) => {
            const newList = [...old.filter((x) => x.id !== itemID),
                {id: itemID, offset }
            ]
            return newList
        })
    }

    function removeItem() {
        console.log('removing: ', itemID)
        setItems((old) => (
            [...old.filter((x) => x.id !== itemID)]
        ))
    }

    useEffect(() => {
        if(!item)
            updateItem({ offset })
    }, [items])

    return { item, items, updateItem, removeItem }
}

const CardItem: FC<{
    style: StyleProp<ViewStyle>
    id: Item['id']
    onRemove: () => void
}> = function ({ style, id, onRemove }) {
    const offset = useSharedValue(0)
    const { item, items, removeItem } = useDraggableItem(id, offset)

    function onPressDelete() {
        onRemove()
        removeItem()
    }

    const onGestureEvent = useAnimatedGestureHandler(
        {
            onStart: (_, ctx) => {},
            onActive: (event, ctx) => {
                console.log('active: ', items.length)
                items.map((x) => {
                    console.log(x)
                })
                // items.forEach((v, k) => {
                //     console.log(k)
                // })
            },
            onEnd: (event) => {}
        }
    )

    return (
        <PanGestureHandler {...{ onGestureEvent }}>
            <Animated.View>
                <Card style={style}>
                    <View style={{ position: 'absolute', right: 10, top: 10 }}>
                        <BorderlessButton
                            style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}
                            onPress={onPressDelete}>
                            <Text style={{ color: Colors.white }}>X</Text>
                        </BorderlessButton>
                    </View>
                </Card>
            </Animated.View>
        </PanGestureHandler>
    )
}



const DynamicItemsScreen: RNNFC<Props> = function ({}) {
    const [items, setItems] = useState<Item[]>([])
    const [animItems, setAnimItems] = useState<AnimatedItem[]>([])

    const { getID } = useUniqueID()

    function onPressAdd() {
        setItems((old) => [
            ...old,
            {
                id: getID('item-'),
                color: colors[Math.floor(Math.random() * colors.length)]
            }
        ])
    }
    function onPressRemove(itemID: Item['id']) {
        console.log('removing: ', itemID)
        setItems((old) => [...old.filter((x) => x.id !== itemID)])
    }

    return (
        <View style={styles.container}>
            <DragListContext.Provider
                value={{ items: animItems, setItems: setAnimItems }}>
                {items.map((x, i) => (
                    <CardItem
                        key={i}
                        id={x.id}
                        onRemove={() => onPressRemove(x.id)}
                        style={{ backgroundColor: x.color }}
                    />
                ))}
            </DragListContext.Provider>

            <View style={styles.btnsContainer}>
                <RectButton style={styles.btn} onPress={onPressAdd}>
                    <Text style={styles.text}>Add Item</Text>
                </RectButton>
            </View>
        </View>
    )
}

DynamicItemsScreen.options = {
    topBar: {
        title: {
            text: 'Draggable List'
        }
    }
}

export { DynamicItemsScreen }
