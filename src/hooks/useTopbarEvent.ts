import { useEffect } from 'react'
import {
    Navigation,
    NavigationButtonPressedEvent
} from 'react-native-navigation'

export type OnTopBtnPressed = (event: NavigationButtonPressedEvent) => void

export const useTopBarBtnPress = function (
    componentId: string,
    onTopBtnPressed: OnTopBtnPressed) {
    useEffect(() => {
        const topBtnListener = Navigation.events().registerNavigationButtonPressedListener((event) => {
            if (event.componentId === componentId)
                onTopBtnPressed(event)
        })
        return () => topBtnListener.remove()
    }, [componentId, onTopBtnPressed])
}
