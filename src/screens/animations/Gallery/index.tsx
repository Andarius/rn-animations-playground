import { Button } from '@src/components'
import { Colors } from '@src/theme'
import React, { useState } from 'react'
import { Image, Text, useWindowDimensions, View } from 'react-native'
import { BaseButton } from 'react-native-gesture-handler'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { GallerySlider } from './GallerySlider'
import { styles } from './styles'


export type Props = {}

export type ImageType = { id: number; uri: string; color: string }

const ALBUM_1: ImageType[] = [
    {
        id: 1,
        uri:
            'https://scontent-cdg2-1.cdninstagram.com/v/t51.2885-15/e35/121274938_345550346665420_1671739911150743503_n.jpg?_nc_ht=scontent-cdg2-1.cdninstagram.com&_nc_cat=104&_nc_ohc=F0TY2DJ-rW4AX9F3yji&_nc_tp=18&oh=41e4f4d17a76abf450be3d919b44651e&oe=5FC06371',
        color: Colors.primary
    },
    {
        id: 2,
        uri:
            'https://scontent-cdg2-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/118464728_232457208077423_1476398399154015353_n.jpg?_nc_ht=scontent-cdg2-1.cdninstagram.com&_nc_cat=111&_nc_ohc=98qCcOjdVk4AX-HrbIO&_nc_tp=15&oh=8f44cdd3b9bbf374874a58df91e10800&oe=5FC12C91',
        color: Colors.secondary
    },
    {
        id: 3,
        uri:
            'https://scontent-cdg2-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/90352431_2584119308540344_3763045772634574830_n.jpg?_nc_ht=scontent-cdg2-1.cdninstagram.com&_nc_cat=104&_nc_ohc=hAhsg_4yOiIAX-Wv-iV&_nc_tp=15&oh=81e500001e17279316604f97841b24b8&oe=5FC1D938',
        color: Colors.tertiary
    }
]

const ALBUM_2: ImageType[] = [
    {
        id: 4,
        uri:
            'https://scontent-cdg2-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/84566518_1037220686650919_7030534366096078664_n.jpg?_nc_ht=scontent-cdg2-1.cdninstagram.com&_nc_cat=111&_nc_ohc=G3NGNxXTfR8AX8uqHRb&_nc_tp=15&oh=8dadf5d0b56d05114e2e945858ca1269&oe=5FC17293',
        color: Colors.primary
    },
    {
        id: 5,
        uri:
            'https://scontent-cdt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/89259695_574913473101901_7566127440172063945_n.jpg?_nc_ht=scontent-cdt1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=YxkaBLNIYPcAX9JV5g0&_nc_tp=15&oh=93dc7a2b1372f29e5115bdb5739e1d5c&oe=5FC4A58F',
        color: Colors.secondary
    }
]

const GalleryScreen: RNNFC<Props> = function ({}) {
    const { width } = useWindowDimensions()

    const [height] = useState<number>(400)
    const [currentPage, setCurrentPage] = useState(0)
    const [images, setImages] = useState(ALBUM_1)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_currentAlbum, setCurrentAlbum] = useState<1 | 2>(1)

    return (
        <View style={styles.container}>
            <GallerySlider
                data={images}
                height={height}
                onIndexChange={(index) => setCurrentPage(index)}
                renderItem={(item) => (
                    <BaseButton
                        rippleColor="transparent"
                        onPress={() => {
                            console.log('pressed: ', item.id)
                        }}>
                        <Image
                            style={{ height, resizeMode: 'contain', width }}
                            source={{ uri: item.uri }}
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
