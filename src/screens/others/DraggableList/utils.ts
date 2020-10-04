import React, { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue
} from 'react-native-reanimated'


export interface IItem {
    offset: Animated.SharedValue<number>
    height: Animated.SharedValue<number>
}

export type ItemID = number
export type Positions = IItem[]
export type GestureState = 'IDLE' | 'ACTIVE' | 'DONE'


export type Config = {
    spacingY: number
    spacingEnd: number
    width: number
    height: number
    verticalOnly: boolean
}

export interface IDraggableItem<T> extends IItem {
    width: number
    id: number,
    data: T
}

export const getItems = function <T>(data: T[], config: Config): IDraggableItem<T>[] {
    const items: IDraggableItem<T>[] = []
    let position = 0
    for (const x of data) {
        items.push({
            height: useSharedValue(config.height),
            offset: useSharedValue((config.height + config.spacingY) * position),
            width: config.width,
            data: x,
            id: position
        })
        position += 1
    }

    return items
}


export function getPositions(data: IItem[]): Positions {
    return data.map((v, _) => ({ offset: v.offset, height: v.height }))
}

export const isOverlapping = function (
    y: number,
    maxY: number,
    y2: number,
    maxY2: number,
    threshPerc: number = 0.5
) {
    'worklet'
    const thresh = (maxY2 - y2) * Math.min(threshPerc, 1)
    // console.log(`[${y}, ${maxY}] | [${y2}, ${maxY2}]`)
    if (y > y2 && y < maxY2 - thresh) return true
    else if (maxY > y2 + thresh && maxY < maxY2) return true
    else return false
}

