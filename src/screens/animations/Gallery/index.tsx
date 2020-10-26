import { Button } from '@src/components'
import { Colors } from '@src/theme'
import React, { useState } from 'react'
import { Image, Text, useWindowDimensions, View } from 'react-native'
import { TapGestureHandler, BaseButton } from 'react-native-gesture-handler'
import { NavigationFunctionComponent as RNNFC } from 'react-native-navigation'
import { GallerySlider } from './Gallery'

import { styles } from './styles'

export type Props = {}

export type ImageType = { id: number; uri: string; color: string }

const IMAGES: ImageType[] = [
    {
        id: 1,
        uri: 'https://scontent-cdg2-1.cdninstagram.com/v/t51.2885-15/e35/121274938_345550346665420_1671739911150743503_n.jpg?_nc_ht=scontent-cdg2-1.cdninstagram.com&_nc_cat=104&_nc_ohc=F0TY2DJ-rW4AX9F3yji&_nc_tp=18&oh=41e4f4d17a76abf450be3d919b44651e&oe=5FC06371',
        color: Colors.primary
    },
    {
        id: 2,
        uri: 'https://scontent-cdg2-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/118464728_232457208077423_1476398399154015353_n.jpg?_nc_ht=scontent-cdg2-1.cdninstagram.com&_nc_cat=111&_nc_ohc=98qCcOjdVk4AX-HrbIO&_nc_tp=15&oh=8f44cdd3b9bbf374874a58df91e10800&oe=5FC12C91',
        color: Colors.secondary
    },
    {
        id: 3,
        uri: 'https://scontent-cdg2-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/90352431_2584119308540344_3763045772634574830_n.jpg?_nc_ht=scontent-cdg2-1.cdninstagram.com&_nc_cat=104&_nc_ohc=hAhsg_4yOiIAX-Wv-iV&_nc_tp=15&oh=81e500001e17279316604f97841b24b8&oe=5FC1D938',
        color: Colors.tertiary
    }
]

const GalleryScreen: RNNFC<Props> = function ({}) {
    const { width } = useWindowDimensions()
    const [height, setHeight] = useState<number>(400)
    const [currentPage, setCurrentPage] = useState(0)
    return (
        <View style={styles.container}>
            <GallerySlider
                data={IMAGES}
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
                {/* <Button
                    style={styles.btn}
                    labelStyle={styles.labelText}
                    label={height === 200 ? '400' : '200'}
                    onPress={() =>
                        setHeight((old) => (old === 200 ? 400 : 200))
                    }
                /> */}
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
