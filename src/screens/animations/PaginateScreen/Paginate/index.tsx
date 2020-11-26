import React, { useEffect, useRef } from 'react'
import { useWindowDimensions } from 'react-native'
import Animated, { 
    makeMutable 
} from 'react-native-reanimated'
import { Offset, Page, Direction } from './Page'

export type { Direction, Offset }

export type RenderProps<T> = {
    item: T
    offset: Offset
    offsetIndex: number
}

export type Props<T> = {
    // An array of size 3 of consecutive data to display
    data: T[]
    renderItem: (props: RenderProps<T>) => React.ReactElement
    initPositions?: number[]
    itemWidth?: number | Animated.SharedValue<number>
    itemHeight: number | Animated.SharedValue<number>
    onDoneMoving?: (direction: Direction) => void
    onInit?: (offsets: Offset[]) => void
    maxSize?: number
}

const Paginate = function <T extends any>({
    data,
    renderItem,
    initPositions,
    itemWidth,
    itemHeight,
    onDoneMoving,
    onInit
}: Props<T>) {
    const { width } = useWindowDimensions()

    const defaultPositions = initPositions ?? [-width, 0, width]
    const offsets = useRef<Offset[]>(
        data.map((_, i) => ({
            x: makeMutable(defaultPositions[i]),
            translateX: makeMutable(0),
            position: makeMutable(i)
        }))
    ).current

    const defaultWidth = itemWidth ?? width

    const _itemWidth: Animated.SharedValue<number> = useRef(
        typeof defaultWidth === 'number'
            ? makeMutable(defaultWidth)
            : defaultWidth
    ).current

    const _itemHeight: Animated.SharedValue<number> = useRef(
        typeof itemHeight === 'number' ? makeMutable(itemHeight) : itemHeight
    ).current

    useEffect(() => {
        if (onInit) onInit(offsets)
    }, [])

    return (
        <>
            {offsets.map((offset, i) => (
                <Page
                    key={i}
                    offset={offset}
                    width={_itemWidth}
                    height={_itemHeight}
                    offsets={offsets}
                    onDoneMoving={onDoneMoving}
                    initPositions={defaultPositions}>
                    {renderItem({
                        item: data[offset.position.value],
                        offsetIndex: i,
                        offset
                    })}
                </Page>
            ))}
        </>
    )
}

export { Paginate }
