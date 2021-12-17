import { Button } from '@src/components'
import { Colors } from '@src/theme'
import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { Barchart, DataItem } from './Barchart'
import { Barchart as BarchartCustom, RenderBarProps } from './BarchartCustom'
import { CustomBarItem } from './BarchartCustom/CustomBarItem'
import { CONFIG, DATA } from './data'

const BARCHART_HEIGHT = 200

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

export type Props = {}

const BarChartScreen: RNNFC<Props> = function ({}) {
    const [data, setData] = useState<DataItem[]>(CONFIG.data)
    const [animate, setAnimate] = useState<boolean>(CONFIG.animate)
    const [horizontal, setHorizontal] = useState<boolean>(false)
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

    const _renderBar = useCallback(
        (props: RenderBarProps) => {
            return (
                <CustomBarItem
                    animate={animate}
                    position={props.position}
                    mounted={props.mounted}
                    barSize={props.barSize}
                    horizontal={true}
                />
            )
        },
        [animate]
    )

    return (
        <View style={styles.container}>
            <View style={[styles.barchartContainer, { marginTop: 20 }]}>
                <Barchart
                    data={data}
                    maxHeight={CONFIG?.maxHeight}
                    minHeight={CONFIG?.minHeight}
                    animate={animate}
                    normalize={CONFIG?.normalize}
                    minValue={CONFIG?.minValue}
                    maxValue={CONFIG?.maxValue}
                    minNormValue={CONFIG?.minNormValue}
                    horizontal={horizontal}
                />
            </View>
            <View style={[styles.barchartContainer, { marginTop: 50 }]}>
                <BarchartCustom
                    data={data}
                    maxHeight={CONFIG?.maxHeight}
                    minHeight={CONFIG?.minHeight}
                    normalize={CONFIG?.normalize}
                    minValue={CONFIG?.minValue}
                    maxValue={CONFIG?.maxValue}
                    minNormValue={CONFIG?.minNormValue}
                    horizontal={true}
                    renderBar={_renderBar}
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
                <Button
                    style={styles.btn}
                    labelStyle={styles.labelText}
                    label={horizontal ? 'Make vertical' : 'Make horizontal'}
                    onPress={() => setHorizontal((old) => !old)}
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
