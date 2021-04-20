import { Colors } from '@src/theme'
import React, { FC } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    withTiming
} from 'react-native-reanimated'

const styles = StyleSheet.create({
    bar: {
        backgroundColor: Colors.primary
    },
    verticalBar: {
        width: 30
    },
    horizontalBar: {
        height: 20
    }
})

export type Props = {
    position: number
    barSize: number
    animate: boolean
    mounted: Animated.SharedValue<boolean>
    horizontal: boolean
}

const CustomBarItem: FC<Props> = function ({
    animate,
    mounted,
    barSize,
    horizontal
}) {
    const _barSize = useDerivedValue(() => {
        return animate
            ? mounted.value
                ? withTiming(barSize, { duration: 300 })
                : 0
            : barSize
    })

    const animatedStyle = useAnimatedStyle(() => {
        return horizontal
            ? { width: _barSize.value }
            : { height: _barSize.value }
    })

    return (
        <Animated.View
            style={[
                animatedStyle,
                styles.bar,
                horizontal ? styles.horizontalBar : styles.verticalBar
            ]}
        />
    )
}

export { CustomBarItem }
