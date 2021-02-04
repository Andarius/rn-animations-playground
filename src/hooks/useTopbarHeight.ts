import { useEffect, useState } from 'react'
import { Navigation } from 'react-native-navigation'

const useTopBarHeight = function (defaultHeight: number = 80) {
    const [_topBarHeight, setTopBarHeight] = useState(defaultHeight)

    useEffect(() => {
        Navigation.constants().then(({ topBarHeight, statusBarHeight }) => {
            setTopBarHeight(topBarHeight + statusBarHeight)
        })
    }, [])

    return _topBarHeight

}
export { useTopBarHeight }
