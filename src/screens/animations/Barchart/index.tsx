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
        value: 207015,
        label: 'May'
    },
    {
        value: 195234,
        label: 'Apr'
    },
    {
        value: 204633,
        label: 'May'
    },
    {
        value: 195234,
        label: 'June'
    },
    {
        value: 436693,
        label: 'Jul.'
    },
    {
        value: 164580,
        label: 'Aug.'
    },
    {
        value: 151261,
        label: 'Sept.'
    },
    {
        value: 207015,
        label: 'Oct.'
    },
    {
        value: 0,
        label: 'Nov.'
    }
]

export type Props = {}

const BarChartScreen: RNNFC<Props> = function ({}) {
    const [data, setData] = useState<DataItem[]>(DATA)
    const [animate, setAnimate] = useState<boolean>(true)

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
                <BarChart data={data} maxHeight={BARCHART_HEIGHT} animate={animate}/>
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
                    label={animate ? 'Disable Animate': 'Enable Animate'}
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
