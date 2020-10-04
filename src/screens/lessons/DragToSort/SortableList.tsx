import React, { FC, ReactElement } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { SortableItem } from './SortableItem'


export type Props = {
    children: ReactElement[]
    item: { width: number; height: number }
}

const SortableList: FC<Props> = function ({ children, item }) {
    const { height } = item
    const offsets = children.map((_, index) => ({
        y: useSharedValue(index * height)
    }))

    return (
        <ScrollView
            // style={styles.container}
            contentContainerStyle={{ height: height * children.length }}>
            {children.map((child, index) => (
                <SortableItem key={index} {...{ offsets, index, item }}>
                    {child}
                </SortableItem>
            ))}
        </ScrollView>
    )
}

export { SortableList }
