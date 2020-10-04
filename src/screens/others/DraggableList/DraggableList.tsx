import React, { FC } from 'react'
import Animated, {
    useAnimatedStyle,
    useDerivedValue
} from 'react-native-reanimated'
import { DraggableItem } from './DraggableItem'
import { IDraggableItem, Config, getItems, getPositions } from './utils'
export type { Config }

export type Props<T = {}> = {
    data: T[]
    renderItem: (
        x: T,
        others: { height: Animated.SharedValue<number> }
    ) => React.ReactElement
    config: Config
}

const DraggableList: FC<Props> = function ({
    data,
    renderItem,
    config,

}) {
    const items = getItems(data, config)
    const positions = getPositions(items)
    const totalHeight = useDerivedValue(() => {
        const maxItem = items.reduce((prev, curr) => {
            if (prev === undefined) return curr
            else if (curr.offset.value > prev.offset.value) return curr
            else return prev
        }, undefined)

        return maxItem.offset.value + maxItem.height.value + config.spacingEnd
    })

    const style = useAnimatedStyle(() => ({
        height: totalHeight.value
    }))

    return (
        <Animated.View
            style={[
                style,
                {
                    // backgroundColor: 'red'
                }
            ]}
            // contentContainerStyle={[
            //     // style,
            //     { backgroundColor: 'red'}
            // ]}>
        >
            {items.map((x, i) => (
                <DraggableItem
                    key={x.id}
                    id={x.id}
                    positions={positions}
                    item={x}
                    spacingY={config.spacingY}
                    verticalOnly={config.verticalOnly}>
                    {renderItem(x.data, { height: x.height })}
                </DraggableItem>
            ))}
        </Animated.View>
    )
}

export { DraggableList }
