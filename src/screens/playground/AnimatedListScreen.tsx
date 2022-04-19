import { Button } from '@src/components'
import { Colors } from '@src/theme'
import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { AnimatedProps, Skeleton } from '../animations/SkeletonScreen/Skeleton'
import { useSkeleton } from '../animations/SkeletonScreen/utils'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemContainer: {
        height: 200,
        width: 300,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export type Props = {}

const ShowColorContext = React.createContext<boolean>(false)
const useShowColorContext = function () {
    const showColor = useContext(ShowColorContext)
    return showColor
}

const ITEMS = [...Array(100).keys()].map((i) => ({ id: i, key: i }))

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList)

const Item: FC<{ key: number; animatedProps: AnimatedProps }> = function ({
    key,
    animatedProps
}) {
    const showOtherColor = useShowColorContext()

    const foregroundColor = !showOtherColor ? undefined : 'red'
    const backgroundColor = !showOtherColor ? undefined : '#FFD080'
    return (
        <View style={styles.itemContainer}>
            <Skeleton
                animatedProps={animatedProps}
                type="rect"
                backgroundColor={backgroundColor}
                foregroundColor={foregroundColor}
                height={200}
                width={300}
            />
        </View>
    )
}

const AnimatedListScreen: FC<Props> = function ({}) {
    const _keyExtractor = useCallback((x) => x.id, [])

    const { animatedProps, startAnimation } = useSkeleton({
        speed: 1.2
    })
    const _renderItem = useCallback(
        (x) => <Item animatedProps={animatedProps} {...x} />,
        [animatedProps]
    )

    const _separatorComponent = useCallback(
        () => <View style={{ height: 10 }} />,
        []
    )

    useEffect(() => {
        startAnimation()
    }, [])

    const [show, setShow] = useState<boolean>(false)

    return (
        <View style={styles.container}>
            <Button label="Show" onPress={() => setShow((old) => !old)} />
            <ShowColorContext.Provider value={show}>
                <AnimatedFlatlist
                    data={ITEMS}
                    renderItem={_renderItem}
                    keyExtractor={_keyExtractor}
                    ItemSeparatorComponent={_separatorComponent}
                />
            </ShowColorContext.Provider>
        </View>
    )
}

export { AnimatedListScreen }
