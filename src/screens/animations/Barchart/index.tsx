import React, { FC, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { Colors } from '@src/theme'
import { BarChart, DataItem } from './BarChart'
import { Button } from '@src/components'

const BARCHART_HEIGHT = 200

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    barchartContainer: {
        height: BARCHART_HEIGHT,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.secondary,
        width: 300
    },
    btnsContainer: {
        position: 'absolute',
        bottom: 0,
        height: 120,
        left: 0,
        right: 0,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    btn: {
        marginTop: 20,
        height: 40,
        width: 110
    },
    labelText: { fontSize: 14, textAlign: 'center' }
})

const DATA: DataItem[] = [
    {
      "value": 204633,
      "label": "Mai"
    },
    {
      "value": 195234,
      "label": "Ju."
    },
    {
      "value": 436693,
      "label": "Jui"
    },
    {
      "value": 164580,
      "label": "Ao."
    },
    {
      "value": 151261,
      "label": "Se."
    },
    {
      "value": 207015,
      "label": "Oc."
    },
    {
      "value": 43098,
      "label": "No."
    }
]

type Config = {
    data: DataItem[]
    animate: boolean
    maxHeight: number
    normalize?: boolean
    minValue?: number
    maxValue?: number
    minHeight?: number
    minNormValue?: number
}

const CONFIG_1 = {
    data: DATA,
    animate: true,
    maxHeight: BARCHART_HEIGHT,
    minNormValue: 0
}

const DATA2: DataItem[] = [
    { label: '', value: 80.51 },
    { label: '', value: 80.45 },
    { label: '', value: 80.21 },
    { label: '', value: 80.38 },
    { label: '', value: 79.53 }
]

const CONFIG_2 = {
    data: DATA2,
    animate: false,
    normalize: false,
    minValue: Math.min(...DATA2.map((x) => x.value)),
    maxValue: Math.max(...DATA2.map((x) => x.value)),
    maxHeight: 50,
    minHeight: 50 / 2,
}

const CONFIG: Config = CONFIG_1

export type Props = {}

const BarChartScreen: RNNFC<Props> = function ({}) {
    const [data, setData] = useState<DataItem[]>(CONFIG.data)
    const [animate, setAnimate] = useState<boolean>(CONFIG.animate)

    function same() {
        setData((old) => [
            ...old.map((x) => ({
                ...x,
                value: 10
            }))
        ])
    }

    function random() {
        setData((old) => [
            ...old.map((x) => ({
                ...x,
                value: Math.random()
            }))
        ])
    }

    return (
        <View style={styles.container}>
            <View style={styles.barchartContainer}>
                <BarChart
                    data={data}
                    maxHeight={CONFIG?.maxHeight}
                    minHeight={CONFIG?.minHeight}
                    animate={animate}
                    normalize={CONFIG?.normalize}
                    minValue={CONFIG?.minValue}
                    maxValue={CONFIG?.maxValue}
                    minNormValue={CONFIG?.minNormValue}
                />
            </View>

            <View style={styles.btnsContainer}>
                <Button
                    style={styles.btn}
                    labelStyle={styles.labelText}
                    label={'Same'}
                    onPress={same}
                />
                <Button
                    style={styles.btn}
                    labelStyle={styles.labelText}
                    label={'Random'}
                    onPress={random}
                />
                <Button
                    style={styles.btn}
                    labelStyle={styles.labelText}
                    label={'Reset'}
                    onPress={() => setData(DATA)}
                />
                <Button
                    style={styles.btn}
                    labelStyle={styles.labelText}
                    label={animate ? 'Disable Animate' : 'Enable Animate'}
                    onPress={() => setAnimate((old) => !old)}
                />
            </View>
        </View>
    )
}

BarChartScreen.options = {
    topBar: {
        title: {
            text: 'Barchart'
        }
    }
}

export { BarChartScreen }
