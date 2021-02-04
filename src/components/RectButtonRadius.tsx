import React, { FC } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import {
    LongPressGestureHandler, RectButton,


    RectButtonProperties, State
} from 'react-native-gesture-handler'

const _extractViewProps = function (style: ViewStyle): [ViewStyle, ViewStyle] {
    const {
        height,
        width,
        borderRadius,
        elevation,
        backgroundColor,
        marginHorizontal,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,
        marginVertical,
        borderTopRightRadius,
        borderTopLeftRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        borderWidth,
        borderColor,
        ...rest
    } = style

    const containerStyle: ViewStyle = {
        height,
        width,
        borderRadius,
        elevation,
        backgroundColor,
        marginHorizontal,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,
        marginVertical,
        borderTopRightRadius,
        borderTopLeftRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        borderWidth,
        borderColor,
    }

    const btnStyle: ViewStyle = {
        height,
        width,
        ...rest
    }

    return [containerStyle, btnStyle]
}

export type Props = RectButtonProperties & {
    style?: StyleProp<ViewStyle>
}

const RectBtnRadius: FC<Props> = function (props) {
    const { style, ...restProps } = props
    const [containerStyle, btnStyle] = _extractViewProps(StyleSheet.flatten(style))
    return (
        <View style={[containerStyle, { overflow: 'hidden' }]}>
            <RectButton style={btnStyle} {...restProps}>
                {props.children}
            </RectButton>
        </View>
    )
}

export type LongPressProps = RectButtonProperties & {
    style?: ViewStyle
    onLongPress: () => void
    minDurationMs?: number
}

const LongPressBtnRadius: FC<LongPressProps> = function (props) {
    const { style, ...restProps } = props
    const [containerStyle, btnStyle] = _extractViewProps(StyleSheet.flatten(style))
    return (
        <LongPressGestureHandler
            onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.ACTIVE) {
                    props.onLongPress()
                }
            }}
            minDurationMs={props.minDurationMs}>
            <View style={[containerStyle, { overflow: 'hidden' }]}>
                <RectButton style={btnStyle} {...restProps}>
                    {props.children}
                </RectButton>
            </View>
        </LongPressGestureHandler>
    )
}

export { RectBtnRadius, LongPressBtnRadius }
