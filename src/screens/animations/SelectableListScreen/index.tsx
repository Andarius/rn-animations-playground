import React, { useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import {
    Navigation,
    NavigationFunctionComponent as RNNFC
} from 'react-native-navigation'
import {
    runOnJS, useAnimatedReaction
} from 'react-native-reanimated'
import { Item } from './Item'
import { useSelected } from './utils'

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

type Item = {
    id: string
    value: number
}

export type Props = {}

const SelectableListScreen: RNNFC<Props> = function ({ componentId }) {
    const [data] = useState<Item[]>(
        [...Array(100).keys()].map((x) => ({ value: x, id: x.toString() }))
    )


    function _onPress(item: Item) {
        console.log('press: ', item)
    }

    const { selected, isSelectMode, onLongPress, onPress } = useSelected({
        onPress: _onPress,
        selectFn: (x) => x.id
    })

    function renderItem(item: Item) {
        return (
            <Item
                {...item}
                isSelectMode={isSelectMode}
                selected={selected}
                onLongPress={() => onLongPress(item)}
                onPress={() => onPress(item)}
            />
        )
    }

    function updateTitle(nbItems: number) {
        Navigation.mergeOptions(componentId, {
            topBar: {
                title: {
                    text:
                        nbItems > 0
                            ? `${nbItems} items selected`
                            : 'Selectable List'
                }
            }
        })
    }

    useAnimatedReaction(
        () => selected.value,
        (_selected) => {
            runOnJS(updateTitle)(_selected.length)
        }
    )

    return (
        <View style={styles.container}>
            <FlatList
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={({ id }) => id}
                data={data}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            />
        </View>
    )
}
SelectableListScreen.options = {
    topBar: {
        title: {
            text: 'Selectable List'
        }
    }
}

export { SelectableListScreen }
