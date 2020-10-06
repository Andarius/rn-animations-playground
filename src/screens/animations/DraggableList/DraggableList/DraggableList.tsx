import React, { useState } from 'react'
import { useWindowDimensions, StyleProp, ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'
import { DraggableItem } from './DraggableItem'
import {
    DragListContext,
    Config,
    getTotalHeight,
    DragListContextItem,
    DefaultItem
} from './utils'

const DEFAULT_CONF: Required<Config> = {
    overlayTreshPercentage: 0.3,
    spacingEnd: 0,
    spacingY: 0,
    verticalOnly: false,
    // TODO: remvove that
    itemHeight: 0,
    itemWidth: 0
}

export type Props<T> = {
    data: T[]
    renderItem: (x: T) => React.ReactElement
    config: Config
    style?: StyleProp<Animated.AnimateStyle<ViewStyle>>
}

const DraggableList = function <T extends DefaultItem>({
    data,
    renderItem,
    config,
    style
}: Props<T>) {
    const _config: Required<Config> = {
        ...DEFAULT_CONF,
        ...config
    }

    const { height } = useWindowDimensions()
    const [items, setItems] = useState<DragListContextItem[]>([])

    const totalHeight = Math.max(
        getTotalHeight(items) + _config.spacingEnd,
        height
    )

    return (
        <Animated.ScrollView
            style={style}
            contentContainerStyle={{
                height: totalHeight
            }}>
            <DragListContext.Provider
                value={{ items, setItems, verticalSpacing: _config.spacingY }}>
                {data.map((x, _) => (
                    <DraggableItem
                        key={x.id}
                        id={x.id}
                        // defaultOffset={defaultOffsets.get(x.id)}
                        spacingY={_config.spacingY}
                        verticalOnly={_config.verticalOnly}
                        itemHeight={_config.itemHeight}
                        itemWidth={_config.itemWidth}
                        overlayTreshPercentage={_config.overlayTreshPercentage}>
                        {renderItem(x)}
                    </DraggableItem>
                ))}
            </DragListContext.Provider>
        </Animated.ScrollView>
    )
}

export { DraggableList }
