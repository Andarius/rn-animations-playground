import React from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'

import { Card, CARD_HEIGHT, CARD_WIDTH } from '@src/components/Card'
import { Colors } from '@src/theme'
import { SortableList } from './SortableList'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cardContainer: {
        height: CARD_HEIGHT,
        width: '100%',
        alignItems: 'center',
        marginTop: 32
    }
})

const CHILDREN = [
    {
        color: Colors.primary
    },
    {
        color: Colors.secondary
    },
    {
        color: Colors.tertiary
    }
]

export type Props = {}

const DragToSortScreen: RNNFC<Props> = function ({}) {
    const { width } = useWindowDimensions()

    return (
        <SortableList item={{ width, height: CARD_HEIGHT + 32 }}>
            {CHILDREN.map((x, i) => (
                <View key={i} style={styles.cardContainer}>
                    <Card style={{ backgroundColor: x.color }} />
                </View>
            ))}
        </SortableList>
    )
}

DragToSortScreen.options = {
    topBar: {
        title: {
            text: 'Drag To Sort',
        },
    }
}

export { DragToSortScreen }
