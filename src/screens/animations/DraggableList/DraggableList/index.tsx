import React, { useImperativeHandle, useMemo } from 'react'
import {
    ScrollView,
    StyleProp,
    ViewStyle
} from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { DraggableItem } from './DraggableItem'
import {
    Config,
    DefaultItem,
    IDraggableItem,
    useDraggableItems
} from './utils'

export type { DefaultItem }
export { DraggableList }

const DEFAULT_CONF: Required<Config> = {
    overlayTreshPercentage: 0.1,
    spacingEnd: 0,
    spacingY: 0,
    minHeight: 0,
    defaultItemHeight: 100,
    defaultItemWidth: 100,
    verticalOnly: false,
    disabled: false,
    activeOffsetY: []
}

export type RenderProps<T> = {
    data: T,
    item: IDraggableItem
}

export type DraggableListRef = {
    getPositions: () => Map<string, number>
}

export type Props<T> = {
    data: T[]
    renderItem: (props: RenderProps<T>) => React.ReactElement
    keyExtractor: (x: T) => string
    config?: Config
    style?: StyleProp<ViewStyle>
    listRef?: React.MutableRefObject<DraggableListRef | undefined>
}

const DraggableList = function <T>({
    data,
    renderItem,
    keyExtractor,
    config,
    style,
    listRef
}: Props<T>) {
    const _config: Required<Config> = useMemo(() => ({ ...DEFAULT_CONF, ...config }), [config])

    const { items, totalHeight, getData } = useDraggableItems(data, keyExtractor, _config)

    const animatedStyle = useAnimatedStyle(() => ({
        height: Math.max(totalHeight.value, _config.minHeight)
    }), [_config])

    const _getPositions = function(){
        return new Map(items.map((x) => [x.id, x.position.value]))
    }

    useImperativeHandle(listRef, () => ({
        getPositions: _getPositions
    }))



    return (
        <ScrollView contentContainerStyle={style}>
            <Animated.View style={[animatedStyle]}>
                {
                    items.map((item, i) =>
                        <DraggableItem
                            key={item.id}
                            {...item}
                            index={i}
                            items={items}
                            itemWidth={_config.defaultItemWidth}
                            spacingY={_config.spacingY}
                            verticalOnly={_config.verticalOnly}
                            disabled={_config.disabled}
                            activeOffsetY={_config.activeOffsetY}
                            overlayTreshPercentage={
                                _config.overlayTreshPercentage
                            }>
                            {renderItem({ data: getData(item.id), item })}
                        </DraggableItem>
                    )
                }

            </Animated.View>
        </ScrollView>
    )
}
