import React, { useContext, useEffect } from 'react'
import Animated from 'react-native-reanimated'


export interface IItem {
    offset: Animated.SharedValue<number>
    height: Animated.SharedValue<number>
}

export type ItemID = string
export type GestureState = 'IDLE' | 'ACTIVE' | 'DONE'


export type Config = {
    spacingY?: number
    spacingEnd?: number
    itemWidth: number
    itemHeight: number
    verticalOnly?: boolean
    overlayTreshPercentage?: number
}

export const isOverlapping = function (
    y: number,
    maxY: number,
    y2: number,
    maxY2: number,
    threshPerc: number = 0.5
) {
    'worklet'
    const thresh = (maxY2 - y2) * Math.min(threshPerc, 1)
    // console.log(`[${y}, ${maxY}] | [${y2}, ${maxY2}]`)
    if (y > y2 && y < maxY2 - thresh) return true
    else if (maxY > y2 + thresh && maxY < maxY2) return true
    else return false
}

const getMaxItem = function(items: IItem[]){
    'worklet'
    let maxItem: IItem | undefined = undefined
    for (const x of items) {
        if (maxItem === undefined) maxItem = x
        else if (x.offset.value > maxItem.offset.value) maxItem = x
    }
    return maxItem
}

export const getTotalHeight = function (items: IItem[]) {
    'worklet'
    const maxItem = getMaxItem(items)
    return maxItem ? maxItem.offset.value + maxItem.height.value : 0
}


export type DefaultItem = {
    id: string
    height?: Animated.SharedValue<number>
    offset?: Animated.SharedValue<number>
}

export const getDefaultOffsets = function(
    data: DragListContextItem[],
    spacingY: number
) {
    const items: Map<string, number> = new Map()
    let position = 0
    for (const x of data) {
        console.log('x.height.value: ', x.height.value)
        items.set(x.id, (x.height.value + spacingY) * position)
        position += 1
    }

    return items
}



/**
 * Context
 */

export type DragListContextItem = IItem & { id: string }

export type DragListContextProps = {
    items: DragListContextItem[]
    setItems: React.Dispatch<React.SetStateAction<DragListContextItem[]>>
    verticalSpacing: number
}
export const DragListContext = React.createContext<DragListContextProps>({
    items: [],
    setItems: () => { },
    verticalSpacing: 0
})


export const useDraggableItem = function (
    itemID: DragListContextItem['id'],
    item?: IItem,
) {
    const { items, setItems, verticalSpacing } = useContext(DragListContext)

    const _item = items.filter((x) => x.id === itemID)[0]

    function updateItem(item: IItem) {
        setItems((old) => {
            const maxItem = getMaxItem(old)
            if(maxItem){
                item.offset.value = maxItem.offset.value + maxItem.height.value + verticalSpacing
            }                
            const newList = [...old.filter((x) => x.id !== itemID),
            { id: itemID, ...item }
            ]
            return newList
        })
    }

    function removeItem() {
        setItems((old) => {
            for(const x of old){
                if(x.id !== itemID && x.offset.value > _item.offset.value)
                    x.offset.value = x.offset.value - _item.height.value - verticalSpacing
            }
            return [...old.filter((x) => x.id !== itemID)]
        })
    }

    useEffect(() => {
        // On new item added
        if (!_item && item)
            updateItem(item)
    }, [items])

    return { item: _item, items, updateItem, removeItem }
}