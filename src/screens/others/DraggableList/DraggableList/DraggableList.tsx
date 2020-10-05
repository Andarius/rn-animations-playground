import React, { FC, useState, useRef, useEffect } from 'react'
import Animated, {
    useAnimatedProps,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue
} from 'react-native-reanimated'
import { DraggableItem } from './DraggableItem'
import {
    DragListContext,
    Config,
    getItems,
    getPositions,
    IDraggableItem,
    IItem, ItemID
} from './utils'


const getDefaultOffsets = function<T extends DefaultItem>(data: T[], config: Config){
    const items: Map<string, number> = new Map()
    let position = 0
    for (const x of data) {
        items.set(x.id, (config.height + config.spacingY) * position)
        position += 1
    }

    return items

}

export type DefaultItem = {
    id: string
    height?: Animated.SharedValue<number>
    offset?: Animated.SharedValue<number>
}

export type Props<T> = {
    data: T[]
    renderItem: (x: T) => React.ReactElement
    config: Config
}


const DraggableList= function<T extends DefaultItem>({ data, renderItem, config }: Props<T>) {

    const [items, setItems] =  useState(new Map<ItemID, IItem>())
    const defaultOffsets = getDefaultOffsets(data, config)
    function updateItem(id: string, data: IItem){
        setItems((old) => new Map([...old, [id, data]]))
    }

    const totalHeight = useDerivedValue(() => {
        return 700
        // console.log('items.values(): ', items.size)
        // if(items.size === 0)
        //     return 0 
        
        // const maxItem = Array.from(items.values()).reduce((prev, curr) => {
        //     if (prev === undefined) return curr
        //     else if (curr.offset.value > prev!.offset.value) return curr
        //     else return prev
        // }, undefined)
        // console.log('max: ', maxItem)
        // return maxItem ? maxItem.offset.value + maxItem.height.value + config.spacingEnd: 0
    })


    // const style = useAnimatedStyle(() => ({
    //     height: totalHeight.value
    // }))

    // const props = useAnimatedProps(() => ({
    //     height: totalHeight.value
    // }))

    return (
        <Animated.ScrollView
            contentContainerStyle={{
                height: totalHeight.value,
                backgroundColor: 'red'
            }}>
            <DragListContext.Provider value={items}>
                {data.map((x, i) => (
                    <DraggableItem
                        key={x.id}
                        id={x.id}
                        spacingY={config.spacingY}
                        verticalOnly={config.verticalOnly}
                        defaultOffset={defaultOffsets.get(x.id)}
                        defaultHeight={config.height}
                        items={items}
                        updateItem={updateItem}
                        >
                        {renderItem(x)}
                    </DraggableItem>
                ))}
            </DragListContext.Provider>
        </Animated.ScrollView>
    )
}

export { DraggableList }
