import { useCallback } from 'react'
import {
    interpolate,
    useAnimatedProps,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated'

export type SkeletonConfig = {
    speed?: number
}

export const useSkeleton = function ({ speed = 1.2 }: SkeletonConfig) {
    const animatedValue = useSharedValue<number>(-1)

    const x1 = useDerivedValue(() =>
        interpolate(animatedValue.value, [-1, 2], [-100, 100], {
            // extrapolateRight: Extrapolate.CLAMP
        })
    )
    const x2 = useDerivedValue(() =>
        interpolate(animatedValue.value, [-1, 2], [0, 200], {
            // extrapolateRight: Extrapolate.CLAMP
        })
    )
    const animatedProps = useAnimatedProps(
        () => ({
            x1: `${x1.value}%`,
            x2: `${x2.value}%`
        }),
        []
    )

    const resetAnimation = useCallback(() => {
        animatedValue.value = -1
    }, [animatedValue])

    const startAnimation = useCallback(() => {
        const duration = speed * 1000
        animatedValue.value = withRepeat(withTiming(2, { duration }), -1, true)
    }, [animatedValue, speed])

    return { animatedProps, startAnimation, resetAnimation }
}
