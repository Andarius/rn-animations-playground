import React, { useState } from 'react'
import {
    useWindowDimensions,
    StyleProp,
    ViewStyle,
    ScrollView
} from 'react-native'
import Animated, {
    useAnimatedStyle,
    useDerivedValue
} from 'react-native-reanimated'
import { DraggableItem } from './DraggableItem'
import {
    DragListContext,
    Config,
    DragListContextItem,
    DefaultItem,
    IItem
} from './utils'

const DEFAULT_CONF: Required<Config> = {
    overlayTreshPercentage: 0.1,
    spacingEnd: 0,
    spacingY: 0,
    verticalOnly: false,
    // TODO: remvove that
    itemHeight: 0,
    itemWidth: 0,
    disabled: false
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

    return (
        <ScrollView style={style}>
            <Animated.View style={[animatedStyle, 
                // { backgroundColor: 'red' }
                ]}>
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
                            defaultOffset={x.offset}
                            spacingY={_config.spacingY}
                            verticalOnly={_config.verticalOnly}
                            itemHeight={x.height ?? _config.itemHeight}
                            itemWidth={_config.itemWidth}
                            disabled={_config.disabled}
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
