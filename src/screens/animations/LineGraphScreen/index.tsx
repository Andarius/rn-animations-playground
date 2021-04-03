import { round } from '@src/animUtils'
import { ReText } from '@src/components'
import { Colors } from '@src/theme'
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { makeMutable, useDerivedValue } from 'react-native-reanimated'
import { Graph, LineItem } from './Graph'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

type Item = {
    ts: number
    speed: number
    bpm: number
    distance: number
    altitude: number
    power: number
}

const TEST_DATA: Item[] = require('./data.json')

const DATA = [
    { x: 0, y: 0 },
    { x: 1, y: 2 },
    { x: 2, y: 7 }
    // { ts: 2, value: 10 },
    // { ts: 4, value: 1 }
]

const DATA2 = [
    { x: 0, y: 7 },
    { x: 1, y: 2 },
    { x: 2, y: 0 }
    // { ts: 2, value: 10 },
    // { ts: 4, value: 1 }
]

const WIDTH = Dimensions.get('window').width - 100
const HEIGHT = 200

const BPM_DATA = TEST_DATA.map((x) => ({ ts: x.ts, value: x.bpm }))

const GRAPHS: LineItem[] = [
    {
        data: DATA,
        currentValue: makeMutable<number>(0),
        color: Colors.primary
    },
    {
        data: DATA2,
        currentValue: makeMutable<number>(0),
        color: Colors.tertiary
    },
    {
        data: TEST_DATA.map((x) => ({ x: x.ts, y: x.bpm })),
        currentValue: makeMutable<number>(0),
        config: {
            minY: Math.min(...BPM_DATA.map((x) => x.value)) - 20,
            maxY: Math.max(...BPM_DATA.map((x) => x.value)) + 20
        }
    }
]

export type Props = {}

const LineGraphScreen: RNNFC<Props> = function ({ componentId }) {
    const textValue = useDerivedValue(() => {
        return round(GRAPHS[0].currentValue.value, 1).toString()
    })

    const textValue2 = useDerivedValue(() => {
        return round(GRAPHS[1].currentValue.value, 1).toString()
    })

    return (
        <View style={styles.container}>
            <View>
                {/* <TouchableOpacity onPress={showFullGraph}>
                    <Text>Show full</Text>
                </TouchableOpacity> */}
            </View>
            <View>
                <ReText text={textValue} />
                <ReText text={textValue2} />
            </View>

            <Graph
                lines={[GRAPHS[0], GRAPHS[1]]}
                height={HEIGHT}
                width={WIDTH}
                containerStyle={{
                    borderWidth: 2,
                    borderColor: Colors.secondary
                }}
            />
        </View>
    )
}

LineGraphScreen.options = {
    topBar: {
        title: {
            text: 'Line Graph'
        }
    }
}

export { LineGraphScreen }
