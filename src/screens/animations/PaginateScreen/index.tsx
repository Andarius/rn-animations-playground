import { Button } from '@src/components'
import { Colors } from '@src/theme'
import React, { useState } from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { OffsetsInfo } from './OffsetInfos'
import { Direction, Offset, Paginate } from './Paginate'


const ITEM_HEIGHT = 100
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'white'
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

const OFFSET_COLORS = new Map([
    [0, Colors.primary],
    [1, Colors.secondary],
    [2, Colors.tertiary]
])

const DATA = [0, 1, 2]

export type Props = {}

const PaginateScreen: RNNFC<Props> = function ({}) {
    const { width } = useWindowDimensions()
    const [data, setData] = useState<number[]>(DATA)

    const itemWidth = width / 3
    const initPositions = [0, itemWidth, itemWidth * 2]
    const initPositions2 = [-width, 0, width]

    function onDoneMoving(direction: Direction) {
        if (direction === 'left') setData((old) => old.map((x) => x + 1))
        else setData((old) => old.map((x) => x - 1))
    }

    const [offsets_1, setOffsets_1] = useState<Offset[]>([])
    const [offsets_2, setOffsets_2] = useState<Offset[]>([])

    function reset() {
        offsets_1.map((x, i) => {
            x.x.value = initPositions[i]
            x.translateX.value = 0
            x.position.value = i
        })
        setData(DATA)
    }

    function reset2(){
        offsets_2.map((x, i) => {
            x.x.value = initPositions2[i]
            x.translateX.value = 0
            x.position.value = i
        })
        setData(DATA)
    }

    return (
        <View style={styles.container}>
            {/* Offset */}

            <OffsetsInfo offsets={offsets_1} />
            <View style={{ height: ITEM_HEIGHT }}>
                <Paginate
                    data={data}
                    itemHeight={ITEM_HEIGHT}
                    itemWidth={itemWidth}
                    initPositions={initPositions}
                    onDoneMoving={onDoneMoving}
                    onInit={(offsets) => setOffsets_1(offsets)}
                    renderItem={({ item, offsetIndex }) => (
                        <View
                            style={[
                                styles.item,
                                {
                                    width: itemWidth,
                                    backgroundColor: OFFSET_COLORS.get(
                                        offsetIndex
                                    )
                                }
                            ]}>
                            <Text style={styles.text}>{item}</Text>
                        </View>
                    )}
                />
            </View>

            <View style={{ marginTop: 50 }} />
            {/* Full width */}
            <OffsetsInfo offsets={offsets_2} />
            <View style={{ height: ITEM_HEIGHT }}>
                <Paginate
                    data={data}
                    itemHeight={ITEM_HEIGHT}
                    onDoneMoving={onDoneMoving}
                    onInit={(offsets) => setOffsets_2(offsets)}
                    renderItem={({ item, offsetIndex }) => {
                        return (
                            <View
                                style={[
                                    styles.item,
                                    {
                                        width,
                                        backgroundColor: OFFSET_COLORS.get(
                                            offsetIndex
                                        )
                                    }
                                ]}>
                                <Text style={styles.text}>{item}</Text>
                            </View>
                        )
                    }}
                />
            </View>
            {/*  */}

            <View style={styles.btnsContainer}>
                <Button
                    style={styles.btn}
                    labelStyle={styles.labelText}
                    label={'Reset'}
                    onPress={reset}
                />

                <Button
                    style={styles.btn}
                    labelStyle={styles.labelText}
                    label={'Reset2'}
                    onPress={reset2}
                />
            </View>
        </View>
    )
}

PaginateScreen.options = {
    topBar: {
        title: {
            text: 'Infinite Pager'
        }
    }
}

export { PaginateScreen }
