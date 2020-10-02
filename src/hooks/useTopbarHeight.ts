import { useEffect, useState } from 'react'
import { Navigation } from 'react-native-navigation'

const useTopBarHeight = function (defaultHeight: number = 80) {
    const [topBarHeight, setTopBarHeight] = useState(defaultHeight)

    useEffect(() => {
        Navigation.constants().then(({ topBarHeight, statusBarHeight }) => {
            setTopBarHeight(topBarHeight + statusBarHeight)
        })
    }, [])

    return topBarHeight

}
export { useTopBarHeight }