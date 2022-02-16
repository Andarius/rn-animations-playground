import { RectBtnRadius, ReText } from '@src/components'
import { Colors } from '@src/theme'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import {
    Gesture,
    GestureDetector,
    RectButton,
    ScrollView
} from 'react-native-gesture-handler'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import Animated, {
    useAnimatedProps,
    useDerivedValue,
    useSharedValue
} from 'react-native-reanimated'

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

const AnimatedButton = Animated.createAnimatedComponent(RectButton)

export type Props = {}

// const AnimatedButton: FC<{ enabled: boolean }> = function ({ enabled }) {
//     return (
//         <RectButton
//             enabled={enabled}
//             style={{
//                 borderRadius: 20,
//                 width: 100,
//                 height: 50,
//                 backgroundColor: Colors.primary
//             }}
//         />
//     )
// }

const OthersScreen: RNNFC<Props> = function ({}) {
    const enabled = useSharedValue<boolean>(false)

    const enableText = useDerivedValue(() =>
        enabled.value ? 'Disable' : 'Enable'
    )

    const onPress = function () {
        console.log('Pressed')
    }

    const animProps = useAnimatedProps(() => {
        return {
            enabled: enabled.value
        }
    }, [])

    const onPress2 = Gesture.Tap()
        .onStart(onPress)
        .onEnd((_event, success) => {
            if (success) {
                console.log('double tap!')
            }
        })

    return (
        <ScrollView style={styles.container}>
            <ReText
                style={{ fontSize: 20, color: Colors.primary }}
                text={enableText}
            />
            <View style={{ margin: 20 }}>
                <RectBtnRadius
                    style={{
                        borderRadius: 20,
                        width: 100,
                        height: 50,
                        backgroundColor: Colors.secondary,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={() => {
                        console.log(enabled.value)
                        enabled.value = !enabled.value
                    }}
                />
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {[...Array(100).keys()].map((i) => (
                    <View key={i}>
                        <GestureDetector gesture={onPress2}>
                            <AnimatedButton
                                style={{
                                    borderRadius: 20,
                                    width: 100,
                                    height: 50,
                                    margin: 5,
                                    backgroundColor: Colors.primary
                                }}
                                animatedProps={animProps}
                            />
                        </GestureDetector>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

OthersScreen.options = {
    topBar: {
        visible: true,
        title: {
            text: 'Others',
            color: Colors.secondary
        },
        backButton: {
            visible: true,
            color: Colors.secondary
        }
    }
}

export { OthersScreen }
