import { Button, ReText } from '@src/components'
import { Colors } from '@src/theme'
import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import Animated, {
    runOnUI,
    useSharedValue
} from 'react-native-reanimated'


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export type Props = {}

const formatDateTime = function (datetime: Date) {
    'worklet'

    return datetime.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
const sayHello = function (text: Animated.SharedValue<string>, from: string) {
    'worklet'

    text.value = `Hello from ${from} on ${Platform.OS} at ${formatDateTime(
        new Date(Date.now())
    )}`
}

const WorkletScreen: RNNFC<Props> = function ({  }) {
    const text = useSharedValue('')

    function onPress() {
        runOnUI(sayHello)(text, 'Hello from Paris')
    }

    return (
        <View style={styles.container}>
            <Button label="Say hello" onPress={onPress} />
            <View style={{ marginTop: 10}} >
            <ReText {...{ text }} />

            </View>
        </View>
    )
}

WorkletScreen.options = {
    topBar: {
        visible: true,
        title: {
            text: 'Worklets',
            color: Colors.secondary
        },
        backButton: {
            visible: true,
            color: Colors.secondary
        }
    }
}

export { WorkletScreen }
