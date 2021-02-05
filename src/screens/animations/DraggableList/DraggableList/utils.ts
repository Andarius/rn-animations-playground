import { useCallback, useEffect, useRef, useState } from 'react'
import { PanGestureHandlerProperties } from 'react-native-gesture-handler'
import Animated, { makeMutable, useDerivedValue } from 'react-native-reanimated'


export type Config = {
    // Spacing between 2 items
    spacingY?: number
    // Spacing between the last item and the bottom
    // of the list
    spacingEnd?: number
    // Min height of the list (useful to fit the screen)
    minHeight?: number
    defaultItemWidth?: number
    defaultItemHeight?: number
    // Can only move vertically
    verticalOnly?: boolean
    // Lock the items
    disabled?: boolean
    overlayTreshPercentage?: number
    activeOffsetY?: PanGestureHandlerProperties['activeOffsetY']
}

export type ItemID = string

export interface IItem {
    offset: Animated.SharedValue<number>
    height: Animated.SharedValue<number>
    position: Animated.SharedValue<number>
}
export interface IDraggableItem extends IItem { id: ItemID }

export type DefaultItem = {
    id: ItemID
    height?: number
    offset?: number
}

export const getOffsets = function (
    data: DefaultItem[],
    defaultHeight: number = 0,
    spacingY: number = 0,
    lastOffset: number = 0
): number[] {
    const offsets = []
    let _lastOffset = lastOffset
    for (const item of data) {
        offsets.push(_lastOffset)
        _lastOffset = _lastOffset + (item.height || defaultHeight) + spacingY
    }

    return offsets
}


const initItems = function (data: DefaultItem[],
                            defaultHeight: number,
                            spacingY: number): IDraggableItem[] {
    const offsets = getOffsets(data, defaultHeight, spacingY)
    return data.map((x, i) => ({
        id: x.id,
        position: makeMutable(i),
        offset: makeMutable(offsets[i]),
        height: makeMutable(x.height ?? defaultHeight),
    }))
}

const checkDiff = function<T extends DefaultItem>(data: T[], dataMap: Map<ItemID, T>){
    const newItems = data.filter((x) => !dataMap.has(x.id))
    const _ids = new Set(data.map((x) => x.id))
    const deletedItems: T[] = Array.from(dataMap.values()).filter((x) => !_ids.has(x.id))
    return {
        newItems,
        deletedItems
    }
}


export function useDraggableItems<T extends DefaultItem>(data: T[], config: Required<Config>) {

    const _dataMap = useRef<Map<ItemID, T>>(new Map(data.map((x) => [x.id, x])))

    const [items, setItems] = useState<IDraggableItem[]>(() =>
        initItems(data,
                config.defaultItemHeight,
                config.spacingY)
                )


    const totalHeight = useDerivedValue(() => {
        const _height = items.map(({ height }) => height.value).reduce((p, n) => p + n, 0) +
                        items.length * config.spacingY +
                        config.spacingEnd
        return _height
    }, [items, config])

    const getData = useCallback((itemID: ItemID): T => {
        const _data = _dataMap.current.get(itemID)
        if (_data === undefined)
            throw new Error(`Could not find data with ID ${itemID}`)
        return _data

    }, [_dataMap])


    const _addNewItems = useCallback((newItems: T[]) => {
        newItems.map((x) => _dataMap.current.set(x.id, x))
        setItems((old) => {
            const lastMaxOffset = Math.max(...old.map((x) => x.offset.value + x.height.value)) + config.spacingY
            const lastPosition = Math.max(...old.map((x) => x.position.value))
            const newOffsets = getOffsets(newItems, config.defaultItemHeight,
                config.spacingY,
                lastMaxOffset
                )
            return [
                ...old,
                ...newItems.map((x, i) => ({
                    id: x.id,
                    position: makeMutable(lastPosition + 1 + i),
                    offset: makeMutable(newOffsets[i]),
                    height: makeMutable(x.height ?? config.defaultItemHeight)
                }))
            ]
        })
    }, [_dataMap, config])

    const _deleteItems = useCallback((deletedItems: T[]) => {
        const deletedIds = new Set(deletedItems.map((x) => x.id))
        setItems((old) => {
            let deletedHeight = 0
            let deletedCount = 0
            const newItems: IDraggableItem[] = []
            old.sort((a, b) => a.position.value - b.position.value)
               .map((x) => {
                if (deletedIds.has(x.id)){
                    deletedHeight += x.height.value + config.spacingY
                    deletedCount += 1
                }
                else {
                    x.offset.value -= deletedHeight
                    x.position.value -= deletedCount
                    newItems.push(x)
                }
            })
            return newItems
        })
        Array.from(deletedIds.values()).map((x) => _dataMap.current.delete(x))
    }, [_dataMap, config])

    useEffect(() => {
        const { newItems, deletedItems} = checkDiff(data, _dataMap.current)
        if (newItems.length > 0) _addNewItems(newItems)
        if (deletedItems.length > 0) _deleteItems(deletedItems)
    }, [data, _addNewItems, _deleteItems])



    return { items, totalHeight, getData }
}

export type GestureState = 'IDLE' | 'ACTIVE' | 'DONE' | 'CREATED'


export const isOverlapping = function (
    y: number,
    maxY: number,
    y2: number,
    maxY2: number,
    threshPerc: number = 0.5
) {
    'worklet'

    // const thresh = ((maxY2 - y2) > (maxY- y) ? (maxY2 - y2): (maxY- y) ) * Math.min(threshPerc, 1)
    const thresh = (maxY2 - y2) * Math.min(threshPerc, 1)
    // console.log(`[${y}, ${maxY}] | [${y2}, ${maxY2}]`)
    if (y > y2 && y < maxY2 - thresh) return true
    else if (maxY > y2 + thresh && maxY < maxY2) return true
    else return false
}
