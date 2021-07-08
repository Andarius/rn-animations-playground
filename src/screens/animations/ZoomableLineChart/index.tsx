import { Button } from '@src/components'
import { Colors } from '@src/theme'
import * as shape from 'd3-shape'
import React, { useCallback, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    PinchGestureHandler
} from 'react-native-gesture-handler'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedReaction,
    useDerivedValue,
    useSharedValue
} from 'react-native-reanimated'
import { parse } from 'react-native-redash'
import Svg from 'react-native-svg'
import { buildGraph } from '../LinechartScreen/Linechart/utils'
import { Line } from './Path'
import { usePinchGesture } from './utils'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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

const BORDER_WIDTH = 2

const WIDTH = 400
const HEIGHT = 400

const GRAPH = buildGraph(
    [
        [0, 0],
        [50, HEIGHT * 0.7],
        [100, HEIGHT * 0.5],
        [150, HEIGHT * 0.1],
        [200, HEIGHT * 0.7],
        [250, HEIGHT * 0.5],
        [300, HEIGHT * 0.1]
    ],
    WIDTH,
    HEIGHT,
    { curve: shape.curveLinear }
).path

type PanContext = {
    tmpOffsetX: number
    tmpOffsetY: number
}

export type Props = {}

const ZoomableLineChartScreen: RNNFC<Props> = function ({}) {
    const path = useRef(parse(GRAPH)).current

    const { onPinchEvent, scale, reset: resetPinch } = usePinchGesture()

    const _translateX = useSharedValue<number>(0)
    const _translateY = useSharedValue<number>(0)

    const _offsetX = useSharedValue<number>(0)
    const _offsetY = useSharedValue<number>(0)

    const scaleOffset = useDerivedValue(() => {
        return ((1 - scale.value) * WIDTH) / 2
    }, [])

    const translateX = useDerivedValue(() => {
        return _translateX.value + _offsetX.value + scaleOffset.value
    }, [])

    useAnimatedReaction(
        () => {
            return scaleOffset.value
        },
        (_scaleOffset) => {
            if (Math.abs(_offsetX.value) > Math.abs(scaleOffset.value)) {
                _offsetX.value =
                    _offsetX.value < 0 ? scaleOffset.value : -scaleOffset.value
            }
        },
        []
    )

    const onGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        PanContext
    >(
        {
            onStart: (_, ctx) => {
                ctx.tmpOffsetX = 0
                ctx.tmpOffsetY = 0
                // console.log('Active')
            },
            onActive: (event, _) => {
                if (
                    Math.abs(_offsetX.value + event.translationX) <
                    Math.abs(scaleOffset.value)
                ) {
                    _translateX.value = event.translationX
                    _translateY.value = event.translationY
                }
            },
            onEnd: (_, ctx) => {
                ctx.tmpOffsetX = _translateX.value
                ctx.tmpOffsetY = _translateY.value

                _translateX.value = 0
                _translateY.value = 0

                _offsetX.value += ctx.tmpOffsetX
                _offsetY.value += ctx.tmpOffsetY
            }
        },
        []
    )

    const resetGesture = useCallback(() => {
        _translateX.value = 0
        _translateY.value = 0
        _offsetX.value = 0
        _offsetY.value = 0
    }, [_offsetX, _offsetY, _translateX, _translateY])

    //https://docs.swmansion.com/react-native-gesture-handler/docs/api/gesture-handlers/pan-gh
    return (
        <View style={styles.container}>
            <PanGestureHandler
                minDist={10}
                maxPointers={1}
                {...{ onGestureEvent }}>
                <Animated.View>
                    <PinchGestureHandler onGestureEvent={onPinchEvent}>
                        <Animated.View
                            style={{
                                height: HEIGHT + BORDER_WIDTH * 2,
                                width: WIDTH + BORDER_WIDTH * 2,
                                borderColor: 'red',
                                borderWidth: BORDER_WIDTH
                            }}>
                            <Svg style={{ backgroundColor: Colors.background }}>
                                <Line
                                    path={path}
                                    scale={scale}
                                    translateX={translateX}
                                />
                            </Svg>
                        </Animated.View>
                    </PinchGestureHandler>
                </Animated.View>
            </PanGestureHandler>
            <View style={styles.btnsContainer}>
                <Button
                    style={styles.btn}
                    labelStyle={styles.btnLabelText}
                    label="reset"
                    onPress={() => {
                        resetGesture()
                        resetPinch()
                    }}
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
