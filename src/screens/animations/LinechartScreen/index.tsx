import { round } from '@src/animUtils'
import { Button, ReText } from '@src/components'
import { useTopBarBtnPress } from '@src/hooks'
import { OnTopBtnPressed } from '@src/hooks/useTopbarEvent'
import { Colors } from '@src/theme'
import * as shape from 'd3-shape'
import React, { useCallback, useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import {
    Navigation,
    NavigationFunctionComponent as RNNFC
} from 'react-native-navigation'
import { Rect } from 'react-native-svg'
import { Linechart } from './Linechart'
import { DataSet, GRAPHS } from './utils'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
        // alignItems: 'center'
    },
    btnsContainer: {
        position: 'absolute',
        bottom: 0,
        // height: 200,
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
    labelText: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: 'bold'
    },
    valueText: {
        fontSize: 14,
        color: Colors.secondary,
        fontWeight: 'bold'
    },
    graphValueContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const WIDTH = Dimensions.get('window').width - 100
const HEIGHT = 200

const fmtWorklet = function (x: number | string): string {
    'worklet'
    return round(Number(x), 1).toString()
}

const fmtFn = function (x: number | string): string {
    return Math.round(Number(x)).toString()
}

export type Props = {}

const LineGraphScreen: RNNFC<Props> = function ({ componentId }) {
    const [datasets, setDatasets] = useState<DataSet[]>([GRAPHS[0]])
    const [showBackground, setShowBackground] = useState<boolean>(false)

    const _displayedDataset = new Set(datasets.map((x) => x.name))

    const onTopBtnPressed: OnTopBtnPressed = useCallback(
        async ({ buttonId }) => {
            switch (buttonId) {
                case 'show-full-graph':
                    await Navigation.showModal({
                        component: {
                            name: 'GraphModal',
                            options: {
                                layout: {
                                    orientation: ['landscape']
                                }
                            },
                            passProps: {
                                lines: datasets
                            }
                        }
                    })
                    break
                default:
                    break
            }
        },
        [datasets]
    )
    useTopBarBtnPress(componentId, onTopBtnPressed)

    return (
        <View style={styles.container}>
            <View
                style={{
                    flex: 0.3,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly'
                }}>
                {GRAPHS.map((x) => (
                    <View style={styles.graphValueContainer} key={x.name}>
                        <Text style={styles.labelText}>{`${x.name}: `}</Text>
                        <View style={{ height: 80, justifyContent: 'center' }}>
                            {_displayedDataset.has(x.name) &&
                            x.currentValue !== undefined ? (
                                <ReText
                                    style={styles.valueText}
                                    text={x.currentValue}
                                    fmtWorklet={fmtWorklet}
                                    fmtFn={fmtFn}
                                />
                            ) : (
                                <Text style={styles.valueText}>-</Text>
                            )}
                        </View>
                    </View>
                ))}
            </View>

            <View style={{ alignItems: 'center', flex: 0.7 }}>
                <Linechart
                    config={{ curve: shape.curveLinear }}
                    lines={datasets}
                    height={HEIGHT}
                    width={WIDTH}
                    containerStyle={{
                        borderWidth: 2,
                        borderColor: Colors.secondary
                    }}>
                    {showBackground && (
                        <>
                            <Rect
                                height={HEIGHT / 3}
                                x={0}
                                y={0}
                                width={WIDTH}
                                fill={Colors.secondary}
                            />
                            <Rect
                                height={HEIGHT / 3}
                                x={0}
                                y={HEIGHT / 3}
                                width={WIDTH}
                                fill={Colors.tertiary}
                            />
                        </>
                    )}
                </Linechart>
            </View>

            <View style={styles.btnsContainer}>
                {GRAPHS.map((_dataset) => (
                    <Button
                        key={_dataset.name}
                        style={styles.btn}
                        labelStyle={styles.btnLabelText}
                        label={
                            _displayedDataset.has(_dataset.name)
                                ? `Hide ${_dataset.name}`
                                : `Show ${_dataset.name}`
                        }
                        onPress={() => {
                            if (_displayedDataset.has(_dataset.name))
                                setDatasets((old) => [
                                    ...old.filter(
                                        (x) => x.name !== _dataset.name
                                    )
                                ])
                            else
                                setDatasets((old) => [
                                    ...old,
                                    ...GRAPHS.filter(
                                        (x) => x.name === _dataset.name
                                    )
                                ])
                        }}
                    />
                ))}
                <Button
                    style={styles.btn}
                    labelStyle={styles.btnLabelText}
                    label={
                        showBackground ? 'Hide background' : 'Show background'
                    }
                    onPress={() => setShowBackground((old) => !old)}
                />
            </View>
        </View>
    )
}

LineGraphScreen.options = {
    topBar: {
        title: {
            text: 'Line Graph'
        },
        rightButtons: [
            {
                id: 'show-full-graph',
                color: Colors.primary,
                icon: require('@img/icons/chart.png')
            }
        ]
    }
}

export { LineGraphScreen }
