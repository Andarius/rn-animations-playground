import React, { FC } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'
import Svg, {
    Circle,
    CircleProps,
    Defs,
    LinearGradient,
    LinearGradientProps,
    Rect,
    RectProps,
    Stop
} from 'react-native-svg'

export type AnimatedProps = Partial<Animated.AnimateProps<LinearGradientProps>>

export type SkeletonContainerProps = {
    width: number
    height: number
    animatedProps: AnimatedProps
    style?: StyleProp<ViewStyle>
    backgroundColor?: string
    foregroundColor?: string
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

const SkeletonContainer: FC<SkeletonContainerProps> = function ({
    width,
    height,
    animatedProps,
    children,
    style,
    backgroundColor = '#f5f6f7',
    foregroundColor = '#eee'
}) {
    return (
        <Svg {...{ width, height, style }}>
            <Defs>
                <AnimatedLinearGradient
                    id="grad"
                    animatedProps={animatedProps}
                    y1="0"
                    y2="0">
                    <Stop offset={0} stopColor={backgroundColor} />
                    <Stop offset={0.5} stopColor={foregroundColor} />
                    <Stop offset={1} stopColor={backgroundColor} />
                    {/* <Stop offset="0" stopColor="#FFD080" stopOpacity="1" />
                    <Stop offset="1" stopColor="red" stopOpacity="1" /> */}
                </AnimatedLinearGradient>
            </Defs>
            {children}
        </Svg>
    )
}

export type SkeletonType = 'circle' | 'rect'

export type Props<T extends SkeletonType> = SkeletonContainerProps & {
    type: T
    props?: T extends 'rect'
        ? RectProps
        : T extends 'circle'
        ? CircleProps
        : never
}
const Skeleton = function <T extends SkeletonType>(props: Props<T>) {
    const { props: _props, type, ...rest } = props
    return (
        <SkeletonContainer {...rest}>
            {type === 'rect' ? (
                <Rect
                    width="100%"
                    height="100%"
                    {...(_props as RectProps)}
                    fill="url(#grad)"
                />
            ) : type === 'circle' ? (
                <Circle
                    cx={rest.width / 2}
                    cy={rest.height / 2}
                    r={rest.width / 2}
                    {...(_props as CircleProps)}
                    fill="url(#grad)"
                />
            ) : null}
        </SkeletonContainer>
    )
}

export { SkeletonContainer, Skeleton }
