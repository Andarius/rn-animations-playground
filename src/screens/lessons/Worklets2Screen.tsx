import React, { FC } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { Colors } from '@src/theme'
import { runOnUI, useDerivedValue, useSharedValue } from 'react-native-reanimated'
import { RectButton } from 'react-native-gesture-handler'
import { ReText } from '@src/components'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    btn: {
        width: 100,
        height: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: Colors.white
    },
    textInfo: {
        color: Colors.primary,
        fontSize: 20
    }
})

export type Props = {}

const Worklets2Screen: RNNFC<Props> = function ({}) {
    const list = useSharedValue<string[]>([])
    const foo = useSharedValue<string>('foo')

    function onPress() {
        // runOnUI(() => {
        //     'worklet'
        //     foo.value = 'bar'
        //     list.value = ['32']
        // })()
        foo.value = 'bar'
        list.value = ['32']
        
    }

    function onPress2() {
        console.log('foo: ', foo.value)
        console.log('list: ', list.value)
    }

    function addItemToList() {
        const _value = [...list.value]
        _value.push(Math.floor(Math.random() * 1000).toString())
        list.value = _value
    }

    const joinedList = useDerivedValue(() => {
        return list.value.join('-')
    }, [list])

    
    console.log('render ')
    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly'
                }}>
                <RectButton style={styles.btn} onPress={onPress}>
                    <Text style={styles.text}>set item</Text>
                </RectButton>
                <RectButton style={styles.btn} onPress={onPress2}>
                    <Text style={styles.text}>log data</Text>
                </RectButton>
                <RectButton style={styles.btn} onPress={addItemToList}>
                    <Text style={styles.text}>add item</Text>
                </RectButton>
            </View>

            <ReText text={foo} style={styles.textInfo}/>
            <ReText text={joinedList} style={styles.textInfo} />
        </View>
    )
}
Worklets2Screen.options = {
    topBar: {
        visible: true,
        title: {
            text: 'Worklet 2',
            color: Colors.secondary
        },
        backButton: {
            visible: true,
            color: Colors.secondary
        }
    }
}

export { Worklets2Screen }
