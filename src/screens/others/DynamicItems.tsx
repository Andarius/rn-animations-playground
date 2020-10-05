import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    RectButton
} from 'react-native-gesture-handler'

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
    offset: Animated.SharedValue<number>
}

type Item = {
    id: string
    color: string
}

const colors = [Colors.primary, Colors.secondary, Colors.tertiary]

type DragListContextProps = {
    items: Map<Item['id'], AnimatedItem>
    updateItems: (itemId: Item['id'], item: AnimatedItem) => void
}
const DragListContext = React.createContext<DragListContextProps>({
    items: new Map(),
    updateItems: () => {}
})

const CardItem: FC<{
    style: StyleProp<ViewStyle>
    id: Item['id']
}> = function ({ style, id }) {
    const offset = useSharedValue(0)

    const { items, updateItems } = useContext(DragListContext)

    useEffect(() => {
        if (!items.has(id)) updateItems(id, { offset })
    }, [items])

    function onPress() {
        console.log('Pressing : ', items.size)
    }

    const onGestureEvent = useAnimatedGestureHandler(
        {
            onStart: (_, ctx) => {},
            onActive: (event, ctx) => {
                console.log('active: ', items.size)
            },
            onEnd: (event) => {}
        },
        [items]
    )

    return (
        <PanGestureHandler {...{ onGestureEvent }}>
            <Animated.View>
                <RectButton onPress={onPress}>
                    <Card style={style} />
                </RectButton>
            </Animated.View>
        </PanGestureHandler>
    )
}

const DynamicItemsScreen: RNNFC<Props> = function ({}) {
    const [items, setItems] = useState<Item[]>([])
    const [animItems, setAnimItems] = useState<Map<string, AnimatedItem>>(
        new Map()
    )

    function onPress() {
        setItems((old) => [
            ...old,
            {
                id: 'item-' + old.length,
                color: colors[Math.floor(Math.random() * colors.length)]
            }
        ])
    }

    function updateItems(itemId: Item['id'], item: AnimatedItem){
        setAnimItems((old) => {
            const newMap = new Map([...old])
            newMap.set(itemId, item)
            return newMap
        })
    }

    return (
        <View style={styles.container}>
            <DragListContext.Provider value={{ items: animItems, updateItems}}>
                {items.map((x, i) => (
                    <CardItem
                        key={i}
                        id={x.id}
                        style={{ backgroundColor: x.color }}
                    />
                ))}
            </DragListContext.Provider>

            <View style={styles.btnsContainer}>
                <RectButton style={styles.btn} onPress={onPress}>
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
