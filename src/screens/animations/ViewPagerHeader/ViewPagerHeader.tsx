import { RectButton } from 'react-native-gesture-handler'
import { Colors } from '@src/theme'
import { getIndex } from '@src/utils'
import React from 'react'
import { StyleSheet, useWindowDimensions, Text, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'


const styles = StyleSheet.create({
    btnsContainer: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        color: Colors.white
    },
    selectedBtn: { },
    selectedText: {
        color: Colors.white
    },
    indicator: {
        position: 'absolute',
        bottom: 4,
        left: 0,
        height: 2,
        backgroundColor: Colors.white,
    }
})

export type Item<T> = {
    data: T
    text: string
}

export type Props<T> = {
    items: Item<T>[]
    currentValue: T
    onPress: (item: T) => void

    btnHeight?: number
    indicatorWidth?: number
}

const ViewPagerHeader = function <T extends string | number>({
    items, currentValue, onPress,
    indicatorWidth = 80,
    btnHeight = 45
}: Props<T>) {

    const { width } = useWindowDimensions()

    const btnWidth = width / items.length

    const itemPosition = getIndex(items, (x) => x.data === currentValue)
    const translateX = useSharedValue<number>(
        (btnWidth - indicatorWidth) / 2 + btnWidth * itemPosition)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: withTiming(translateX.value, { duration: 200, easing: Easing.inOut(Easing.cubic) }) }
        ]
    }), [])

    return (
        <View style={styles.btnsContainer}>
            <Animated.View style={[styles.indicator, { width: indicatorWidth }, animatedStyle]} />
            {
                items.map(({ data, text }, index) =>
                    <RectButton
                        key={index}
                        style={[
                            styles.btn,
                            { width: btnWidth, height: btnHeight },
                            currentValue === data && styles.selectedBtn
                        ]}
                        onPress={() => {
                            onPress(data)
                            translateX.value = (btnWidth - indicatorWidth) / 2 + btnWidth * index
                        }}>
                        <Text
                            style={[
                                styles.text,
                                currentValue === data && styles.selectedText
                            ]}>
                            {text}
                        </Text>
                    </RectButton>

                )
            }
        </View>
    )
}


export { ViewPagerHeader }
