import React, { FC } from 'react'
import {
    Platform,
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle
} from 'react-native'
import {
    LongPressGestureHandler,
    RectButton,
    RectButtonProperties,
    State
} from 'react-native-gesture-handler'

const DEFAULT_RIPPLE_COLOR = undefined

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
        alignSelf,
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
        alignSelf
    }

    const btnStyle: ViewStyle = {
        height,
        width,
        alignSelf,
        ...rest
    }

    return [containerStyle, btnStyle]
}

export type Props = RectButtonProperties & {
    style?: StyleProp<ViewStyle>
}

class RectBtnRadius extends React.Component<Props> {
    render(): React.ReactNode {
        const { style, testID, children, rippleColor, ...restProps } =
            this.props
        const _flattenedStyle = StyleSheet.flatten(style)
        if (Platform.OS === 'android') {
            const _rippleColor = rippleColor ?? DEFAULT_RIPPLE_COLOR
            const [containerStyle, btnStyle] =
                _extractViewProps(_flattenedStyle)
            return (
                <View
                    style={[containerStyle, { overflow: 'hidden' }]}
                    testID={testID}>
                    <RectButton
                        style={btnStyle}
                        rippleColor={_rippleColor}
                        {...restProps}>
                        {children}
                    </RectButton>
                </View>
            )
        } else {
            // See: https://github.com/software-mansion/react-native-gesture-handler/issues/294
            if (this.props.enabled ?? true)
                return (
                    <View testID={testID}>
                        <RectButton {...restProps} style={_flattenedStyle}>
                            {children}
                        </RectButton>
                    </View>
                )
            else
                return (
                    <View testID={testID} style={_flattenedStyle}>
                        {children}
                    </View>
                )
        }
    }
}

export type LongPressProps = RectButtonProperties & {
    style?: ViewStyle
    onLongPress: () => void
    minDurationMs?: number
}

const LongPressBtnRadius: FC<LongPressProps> = function (props) {
    const { testID, children, style, rippleColor, ...restProps } = props
    const _flattenedStyle = StyleSheet.flatten(style)
    const [containerStyle, btnStyle] = _extractViewProps(_flattenedStyle)
    const _rippleColor = rippleColor ?? DEFAULT_RIPPLE_COLOR
    return (
        <>
            {__DEV__ && (
                <Pressable
                    testID={`${testID}-longPress`}
                    onPress={props.onLongPress}
                />
            )}
            <LongPressGestureHandler
                onHandlerStateChange={({ nativeEvent }) => {
                    if (nativeEvent.state === State.ACTIVE) {
                        props.onLongPress()
                    }
                }}
                minDurationMs={props.minDurationMs ?? 600}>
                {Platform.OS === 'android' ? (
                    <View
                        style={[containerStyle, { overflow: 'hidden' }]}
                        testID={testID}>
                        <RectButton
                            style={btnStyle}
                            rippleColor={_rippleColor}
                            {...restProps}>
                            {children}
                        </RectButton>
                    </View>
                ) : (
                    <View testID={testID}>
                        <RectButton
                            style={_flattenedStyle}
                            rippleColor={_rippleColor}
                            {...restProps}>
                            {children}
                        </RectButton>
                    </View>
                )}
            </LongPressGestureHandler>
        </>
    )
}

const LongPressBtn: FC<LongPressProps> = function (props) {
    const { onLongPress, children, testID, ..._props } = props
    return (
        <>
            {__DEV__ && (
                <Pressable
                    testID={`${testID}-longPress`}
                    onPress={onLongPress}
                />
            )}
            <LongPressGestureHandler
                onHandlerStateChange={({ nativeEvent }) => {
                    if (nativeEvent.state === State.ACTIVE) {
                        onLongPress()
                    }
                }}
                minDurationMs={props.minDurationMs ?? 600}>
                <RectButton {..._props} testID={testID}>
                    {children}
                </RectButton>
            </LongPressGestureHandler>
        </>
    )
}

export { RectBtnRadius, LongPressBtnRadius, LongPressBtn }
