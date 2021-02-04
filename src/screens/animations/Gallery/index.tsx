import { Button } from '@src/components'
import { Colors } from '@src/theme'
import React, { useState } from 'react'
import { Image, Text, useWindowDimensions, View } from 'react-native'
import { BaseButton } from 'react-native-gesture-handler'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { GallerySlider } from './GallerySlider'
import { styles } from './styles'


export type Props = {}

export type ImageType = { id: number; uri: number; color: string }

const ALBUM_1: ImageType[] = [
    {
        id: 1,
        uri: require('@img/choubs_1.jpg'),
        color: Colors.primary
    },
    {
        id: 2,
        uri: require('@img/choubs_2.jpg'),
        color: Colors.secondary
    },
    {
        id: 3,
        uri: require('@img/choubs_3.jpg'),
        color: Colors.tertiary
    }
]

const ALBUM_2: ImageType[] = [
    {
        id: 4,
        uri: require('@img/choubs_2.jpg'),
        color: Colors.primary
    },
    {
        id: 5,
        uri: require('@img/choubs_3.jpg'),
        color: Colors.secondary
    }
]

const GalleryScreen: RNNFC<Props> = function ({ }) {
    const { width } = useWindowDimensions()

    const [height] = useState<number>(400)
    const [currentPage, setCurrentPage] = useState(0)
    const [images, setImages] = useState(ALBUM_1)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_currentAlbum, setCurrentAlbum] = useState<1 | 2>(1)

    return (
        <View style={styles.container}>
            <GallerySlider
                data={images}
                height={height}
                onIndexChange={(index) => setCurrentPage(index)}
                renderItem={(item) => (
                    <BaseButton
                        rippleColor="transparent"
                        // style={{ backgroundColor: 'red' }}
                        onPress={() => {
                            console.log('pressed: ', item.id, item.uri)
                        }}>
                        <Image
                            style={{ height, resizeMode: 'contain', width }}
                            source={item.uri}
                            onError={(error) => console.log('error: ', error.nativeEvent)}
                        />
                    </BaseButton>
                )}
            />

            <View
                style={{
                    marginTop: 100,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <Text style={{ fontSize: 20, color: Colors.primary }}>
                    Curent page: {currentPage}
                </Text>
            </View>

            <View style={styles.btnsContainer}>
                <Button
                    style={styles.btn}
                    labelStyle={styles.labelText}
                    label={'Remove image'}
                    onPress={() =>
                        setImages((old) => [
                            ...old.filter((_, i) => i !== currentPage)
                        ])
                    }
                />
                <Button
                    style={styles.btn}
                    labelStyle={styles.labelText}
                    label={'Switch images'}
                    onPress={() => {
                        setCurrentAlbum((old) => {
                            const currAlbum = old === 1 ? 2 : 1
                            setImages(currAlbum === 1 ? ALBUM_2 : ALBUM_1)
                            return currAlbum
                        })
                    }}
                />
                {images.length < ALBUM_1.length && (
                    <Button
                        style={styles.btn}
                        labelStyle={styles.labelText}
                        label={'Add image'}
                        onPress={() =>
                            setImages((old) => {
                                const prevIds = old.map((x) => x.id)
                                const toAdd = ALBUM_1.filter(
                                    (x) => !prevIds.includes(x.id)
                                )[0]
                                return [...old, toAdd]
                            })
                        }
                    />
                )}
            </View>
        </View>
    )
}
GalleryScreen.options = {
    topBar: {
        title: {
            text: 'Images Gallery'
        }
    }
}

export { GalleryScreen }
