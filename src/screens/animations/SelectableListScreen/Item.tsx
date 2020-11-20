import React, { FC, useRef, ReactNode } from 'react'
import { View, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native'
import { Colors } from '@src/theme'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import {
    LongPressGestureHandler,
    State,
    RectButtonProperties,
    RectButton
} from 'react-native-gesture-handler'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        height: 100,
        elevation: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

type LongPressBtnProps = RectButtonProperties & {
    style?: StyleProp<ViewStyle>
    onLongPress: () => void
    minDurationMs?: number
} & { children?: ReactNode }

const LongPressBtn = function (props: LongPressBtnProps) {
    const { onLongPress, style, minDurationMs, children, ...rest } = props
    return (
        <LongPressGestureHandler
            onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.ACTIVE) {
                    onLongPress()
                }
            }}
            minDurationMs={minDurationMs}>
            <RectButton style={style} {...rest}>
                {children}
            </RectButton>
        </LongPressGestureHandler>
    )
}

export type Props = {
    id: string
    value: number
    isSelectMode: Animated.SharedValue<boolean>
    selected: Animated.SharedValue<string[]>
    onLongPress: () => void
    onPress: () => void
}

const Item: FC<Props> = function ({
    value,
    id,
    onLongPress,
    onPress,
    selected,
    isSelectMode
}) {
    const renderCount = useRef<number>(0)

    renderCount.current += 1

    const animatedStyle = useAnimatedStyle(() => ({
        backgroundColor: selected.value.includes(id)
            ? Colors.tertiary
            : isSelectMode.value
            ? Colors.secondary
            : Colors.primary
    }))
    return (
        <LongPressBtn onLongPress={onLongPress} onPress={onPress}>
            <Animated.View style={[animatedStyle, styles.container]}>
                <View style={{ position: 'absolute', top: 10, right: 20 }}>
                    <Text style={{ color: Colors.white }}>
                        {renderCount.current}
                    </Text>
                </View>
                <Text style={{ fontSize: 20, color: Colors.white }}>
                    {value}{' '}
                </Text>
            </Animated.View>
        </LongPressBtn>
    )
}
const equals = function (prev: Props, next: Props) {
    return prev.value === next.value
}

const ItemMemo = React.memo(Item, equals)
export { ItemMemo as Item }
