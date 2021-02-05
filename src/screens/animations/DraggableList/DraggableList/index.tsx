import React, { useMemo } from 'react'
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

export type Props<T> = {
    data: T[]
    renderItem: (props: RenderProps<T>) => React.ReactElement
    config?: Config
    style?: StyleProp<ViewStyle>
}

const DraggableList = function <T extends DefaultItem>({
    data,
    renderItem,
    config,
    style
}: Props<T>) {
    const _config: Required<Config> = useMemo(() => ({ ...DEFAULT_CONF, ...config }), [config])

    const { items, totalHeight, getData } = useDraggableItems(data, _config)

    const animatedStyle = useAnimatedStyle(() => ({
        height: Math.max(totalHeight.value, _config.minHeight)
    }), [_config])

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


