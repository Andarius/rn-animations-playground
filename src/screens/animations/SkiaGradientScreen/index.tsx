import { Canvas, Circle, Group } from '@shopify/react-native-skia'
import React from 'react'
import { StyleSheet } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export type Props = {}

const SkiaGradientScreen: RNNFC<Props> = function ({}) {
    const width = 256
    const height = 256
    const r = 215
    return (
        // <View style={styles.container}>
        <Canvas style={{ flex: 1 }}>
            <Group blendMode="multiply">
                <Circle cx={r} cy={r} r={r} color="cyan" />
                <Circle cx={width - r} cy={r} r={r} color="magenta" />
                <Circle cx={width / 2} cy={height - r} r={r} color="yellow" />
            </Group>
        </Canvas>
        // </View>
    )
}

SkiaGradientScreen.options = {
    topBar: {
        title: {
            text: 'Skia gradient'
        }
    }
}

export { SkiaGradientScreen }
