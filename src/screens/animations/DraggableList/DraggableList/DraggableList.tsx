import React, { useRef, useState } from 'react'
import {
    ScrollView, StyleProp,
    ViewStyle
} from 'react-native'
import Animated, {
    useAnimatedStyle,
    useDerivedValue
} from 'react-native-reanimated'
import { DraggableItem } from './DraggableItem'
import {
    Config,
    DefaultItem, DragListContext,
    DragListContextItem,
    getOffsets
} from './utils'

const DEFAULT_CONF: Required<Config> = {
    overlayTreshPercentage: 0.1,
    spacingEnd: 0,
    spacingY: 0,
    verticalOnly: false,
    // TODO: remvove that
    itemHeight: 0,
    itemWidth: 0,
    disabled: false,
    activeOffsetY: []
}

export type Props<T> = {
    data: T[]
    renderItem: (x: T) => React.ReactElement
    config: Config
    style?: StyleProp<ViewStyle>
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

    const [items, setItems] = useState<DragListContextItem[]>([])

    const totalHeight = useDerivedValue(() => {
        return items.map((x) => x.height.value).reduce((p, n) => p + n, 0) + items.length * _config.spacingY + _config.spacingEnd
    }, [items])

    const animatedStyle = useAnimatedStyle(() => ({
        height: totalHeight.value
    }))

    const initialOffsets = useRef(getOffsets(data, config.itemHeight, config.spacingY)).current

    return (
        <ScrollView contentContainerStyle={style}>
            <Animated.View style={[animatedStyle]}>
                <DragListContext.Provider
                    value={{
                        items,
                        setItems,
                        verticalSpacing: _config.spacingY
                    }}>
                    {data.map((x, i) => (
                        <DraggableItem
                            key={x.id}
                            id={x.id}
                            index={i}
                            defaultOffset={x.offset ?? initialOffsets[i]}
                            spacingY={_config.spacingY}
                            verticalOnly={_config.verticalOnly}
                            itemHeight={x.height ?? _config.itemHeight}
                            itemWidth={_config.itemWidth}
                            disabled={_config.disabled}
                            activeOffsetY={_config.activeOffsetY}
                            overlayTreshPercentage={
                                _config.overlayTreshPercentage
                            }>
                            {renderItem(x)}
                        </DraggableItem>
                    ))}
                </DragListContext.Provider>
            </Animated.View>
        </ScrollView>
    )
}

export { DraggableList }
