import { useSharedValue } from '@src/utils'
import React from 'react'
import { View, useWindowDimensions } from 'react-native'
import Animated, {
    //@ts-expect-error
    useAnimatedReaction
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
    const offsets: Offset[] = data.map((_, i) => ({
        x: useSharedValue<number>(i === 0 ? 0 : width),
        translateX: useSharedValue<number>(0),
        tmpX: useSharedValue<number>(0)
    }))

    useAnimatedReaction(
        () => currentIndex.value,
        (newIndex: number) => {
            if (onIndexChange) onIndexChange(newIndex)
        }
    )

    return (
        <View style={{ height }}>
            {data.map((x, i) => (
                <GalleryItem
                    key={x.id}
                    index={i}
                    currentIndex={currentIndex}
                    height={height}
                    offset={offsets[i]}
                    isMoving={isMoving}
                    prevOffset={i === 0 ? undefined : offsets[i - 1]}
                    nextOffset={i === data.length ? undefined : offsets[i + 1]}>
                    {renderItem(x)}
                </GalleryItem>
            ))}
        </View>
    )
}

export { GallerySlider }
