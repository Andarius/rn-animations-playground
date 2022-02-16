import { Colors } from '@src/theme'
import React, { useEffect } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { Skeleton } from './Skeleton'
import { useSkeleton } from './utils'

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export type Props = {
    defaultSpeed?: number
}

const SkeletonScreen: RNNFC<Props> = function ({ defaultSpeed = 1.2 }) {
    const { animatedProps, startAnimation, resetAnimation } = useSkeleton({
        speed: defaultSpeed
    })

    useEffect(() => {
        startAnimation()
        return () => resetAnimation()
    }, [resetAnimation, startAnimation])

    // '#f5f6f7',
    // foregroundColor: '#eee',
    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    height: 200,
                    justifyContent: 'space-evenly'
                }}>
                <Skeleton
                    animatedProps={animatedProps}
                    type="rect"
                    style={{ elevation: 2 }}
                    width={300}
                    height={50}
                />
                <Skeleton
                    animatedProps={animatedProps}
                    type="rect"
                    backgroundColor="#FFD080"
                    foregroundColor="red"
                    width={300}
                    height={50}
                />
                <View
                    style={{
                        elevation: 2,
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        overflow: 'hidden'
                    }}>
                    <Skeleton
                        animatedProps={animatedProps}
                        type="circle"
                        width={50}
                        height={50}
                    />
                </View>

                <Skeleton
                    animatedProps={animatedProps}
                    type="circle"
                    backgroundColor="#FFD080"
                    foregroundColor="red"
                    width={50}
                    height={50}
                />
            </View>
        </SafeAreaView>
    )
}

SkeletonScreen.options = {
    topBar: {
        visible: true,
        title: {
            text: 'Skeleton',
            color: Colors.secondary
        },
        backButton: {
            visible: true,
            color: Colors.secondary
        }
    }
}

export { SkeletonScreen }
