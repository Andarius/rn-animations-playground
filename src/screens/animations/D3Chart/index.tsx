import { Button } from '@src/components'
import { scaleLinear } from 'd3-scale'
import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { useLine } from './d3'

const styles = StyleSheet.create({
    container: {
        flex: 1
        // justifyContent: 'center',
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
    }
})

const WIDTH = 400
const HEIGHT = 400

const DATA = [
    [0, 0],
    [50, HEIGHT * 0.7],
    [100, HEIGHT * 0.5],
    [150, HEIGHT * 0.1],
    [200, HEIGHT * 0.7],
    [250, HEIGHT * 0.5],
    [300, HEIGHT * 0.1],
    [400, HEIGHT]
] as [number, number][]

export type Props = {}

const D3ChartScreen: RNNFC<Props> = function ({}) {
    const scaleX = scaleLinear().domain([0, WIDTH]).range([0, WIDTH])

    const scaleY = scaleLinear().domain([0, HEIGHT]).range([0, HEIGHT])

    const { getLine } = useLine(
        DATA,
        //@ts-expect-error
        ([, x]) => scaleX(x),
        //@ts-expect-error
        ([y]) => scaleY(y)
    )
    const path = useRef(getLine())
    console.log(path)
    return (
        <View style={styles.container}>
            <View style={styles.btnsContainer}>
                <Button
                    style={styles.btn}
                    labelStyle={styles.btnLabelText}
                    label="test data"
                    onPress={() => {}}
                />
            </View>
        </View>
    )
}

D3ChartScreen.options = {
    topBar: {
        title: {
            text: 'D3 Charts'
        }
    }
}

export { D3ChartScreen }
