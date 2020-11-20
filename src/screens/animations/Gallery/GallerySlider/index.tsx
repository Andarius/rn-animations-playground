import { getArrayDiff } from '@src/utils'
import React, { useEffect, useRef, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import Animated, {
    //@ts-expect-error
    runOnJS,
    useAnimatedReaction,
    useSharedValue
} from 'react-native-reanimated'
import { GalleryItem, Offset } from './GalleryItem'

export type Props<T> = {
    data: T[]
    height: number
    renderItem: (item: T) => React.ReactElement
    onIndexChange?: (index: number) => void
    currentPage?: Animated.SharedValue<number>
}

export type GalleryItemType = { id: number }

const GallerySlider = function <T extends GalleryItemType>({
    data,
    height,
    currentPage,
    onIndexChange,
    renderItem
}: Props<T>) {
    const { width } = useWindowDimensions()

    const isMoving = useSharedValue<boolean>(false)
    const currentIndex = currentPage ?? useSharedValue<number>(0)
    const ids = useRef<number[]>([])
    const [offsets, setOffsets] = useState<(Offset & { id: number })[]>([])

    useAnimatedReaction(
        () => currentIndex.value,
        (newIndex: number) => {
            if (onIndexChange) runOnJS(onIndexChange)(newIndex)
        }
    )

    function onInit(id: number, offset: Offset) {
        if (!ids.current.includes(id)) ids.current.push(id)

        setOffsets((old) => {
            const _ids = old.map((x) => x.id)
            if (_ids.includes(id)) return old
            else return [...old, { id, ...offset }]
        })
    }

    useEffect(() => {
        const changedIds = getArrayDiff(
            ids.current,
            data.map((x) => x.id)
        )

        offsets.map((x, i) => {
            x.x.value = i === currentIndex.value ? 0 : width
            x.translateX.value = 0
        })

        if (changedIds.length > 0) {
            const removedItems = data.length < ids.current.length
            if (removedItems)
                setOffsets((old) => {
                    const cp = [
                        ...old.filter((x) => !changedIds.includes(x.id))
                    ]
                    ids.current = cp.map((x) => x.id)
                    if (cp.length > 0) {
                        cp[0].x.value = 0
                        currentIndex.value = 0
                    }
                    return cp
                })
        }
    }, [data])

    return (
        <View style={{ height }}>
            {data.map((x, i) => (
                <GalleryItem
                    key={x.id}
                    index={i}
                    id={x.id}
                    currentIndex={currentIndex}
                    height={height}
                    isMoving={isMoving}
                    onInit={onInit}
                    prevOffset={i === 0 ? undefined : offsets[i - 1]}
                    nextOffset={i === data.length ? undefined : offsets[i + 1]}>
                    {renderItem(x)}
                </GalleryItem>
            ))}
        </View>
    )
}

export { GallerySlider }
