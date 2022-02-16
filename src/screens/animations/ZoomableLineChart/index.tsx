import { Button, ReText } from '@src/components'
import { Colors } from '@src/theme'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { useDerivedValue } from 'react-native-reanimated'
import { WEIGHT } from './data'
import { useZoomableChart, ZoomableChart } from './ZoomableChart'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    btnsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    btn: {
        marginVertical: 10,
        height: 40,
        width: 110
    },
    btnLabelText: {
        fontSize: 14,
        textAlign: 'center'
    },
    text: {
        paddingBottom: 5,
        color: Colors.secondary,
        fontSize: 18
    },
    reText: {
        color: Colors.primary,
        fontSize: 16
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 40
    }
})

const WIDTH = 400
const HEIGHT = 400

export type DataItem = [number, number]
const DATA = [
    [0, 0],
    [50, HEIGHT * 0.7],
    [100, HEIGHT * 0.5],
    [150, HEIGHT * 0.1],
    [200, HEIGHT * 0.7],
    [250, HEIGHT * 0.5],
    [300, HEIGHT * 0.1],
    [400, HEIGHT]
] as DataItem[]

export type Props = {}

const ZoomableLineChartScreen: RNNFC<Props> = function ({}) {
    const [data, setData] = useState<DataItem[]>(DATA)
    const [showDots, setShowDots] = useState<boolean>(true)

    const {
        scale,
        translateX,
        focalX,
        scaleOffset,
        translateNorm,
        pinchGesture,
        panGesture,
        reset
    } = useZoomableChart({ width: WIDTH })

    const virtualWidth = useDerivedValue(
        () =>
            scale?.value !== undefined
                ? (scale.value * WIDTH).toFixed(1).toString()
                : '',
        [scale, WIDTH]
    )
    const scaleFmt = useDerivedValue(
        () =>
            scale?.value !== undefined ? scale.value.toFixed(1).toString() : '',
        [scale]
    )
    const translateXFmt = useDerivedValue(
        () =>
            translateX?.value !== undefined
                ? translateX.value.toFixed(1).toString()
                : '',
        [translateX]
    )
    const focalXFmt = useDerivedValue(
        () =>
            focalX?.value !== undefined
                ? focalX.value.toFixed(1).toString()
                : '',
        [focalX]
    )
    const translateNormalized = useDerivedValue(() => {
        return translateNorm?.value !== undefined
            ? translateNorm.value.toFixed(2).toString()
            : ''
    }, [translateNorm])

    const scaleOffsetFmt = useDerivedValue(() => {
        return scaleOffset?.value !== undefined
            ? scaleOffset.value.toFixed(1).toString()
            : '0'
    }, [scaleOffset])

    //https://docs.swmansion.com/react-native-gesture-handler/docs/api/gesture-handlers/pan-gh
    return (
        <View style={styles.container}>
            <View
                style={{
                    width: '100%',
                    flex: 0.4
                }}>
                <View style={styles.textRow}>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.text]}>Scale: </Text>
                        <ReText style={styles.reText} text={scaleFmt} />
                    </View>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.text]}>Width: </Text>
                        <ReText style={styles.reText} text={virtualWidth} />
                    </View>
                </View>
                <View style={styles.textRow}>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.text]}>Translate X: </Text>
                        <ReText style={styles.reText} text={translateXFmt} />
                    </View>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.text]}>Trans norm X: </Text>
                        <ReText
                            style={styles.reText}
                            text={translateNormalized}
                        />
                    </View>
                </View>
                <View style={styles.textRow}>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.text]}>Scale offset </Text>
                        <ReText style={styles.reText} text={scaleOffsetFmt} />
                    </View>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.text]}>Focal X: </Text>
                        <ReText style={styles.reText} text={focalXFmt} />
                    </View>
                </View>
            </View>

            <ZoomableChart
                style={{ borderWidth: 2, borderColor: 'red' }}
                height={HEIGHT}
                width={WIDTH}
                {...{
                    data,
                    showDots,
                    focalX,
                    translateX,
                    scale,
                    panGesture,
                    pinchGesture
                }}
            />
            <View style={styles.btnsContainer}>
                <Button
                    style={styles.btn}
                    labelStyle={styles.btnLabelText}
                    label="Dataset 1"
                    onPress={() => {
                        reset()
                        setData(DATA)
                    }}
                />
                <Button
                    style={styles.btn}
                    labelStyle={styles.btnLabelText}
                    label="Dataset 2"
                    onPress={() => {
                        reset()
                        setData(WEIGHT)
                    }}
                />
                <Button
                    style={styles.btn}
                    labelStyle={styles.btnLabelText}
                    label={showDots ? 'Hide dots' : 'Show dots'}
                    onPress={() => {
                        setShowDots((old) => {
                            return !old
                        })
                    }}
                />
                <Button
                    style={styles.btn}
                    labelStyle={styles.btnLabelText}
                    label="reset"
                    onPress={reset}
                />
            </View>
        </View>
    )
}

ZoomableLineChartScreen.options = {
    topBar: {
        title: {
            text: 'Zoomable Linechart'
        }
    }
}

export { ZoomableLineChartScreen }
