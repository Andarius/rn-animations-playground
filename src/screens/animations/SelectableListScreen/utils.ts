import Animated, { useSharedValue } from "react-native-reanimated"

type Props<ItemType, ItemKeyType> = {
    onPress: (x: ItemType) => void,
    onEnter?: () => void,
    onExit?: () => void
    selectFn?: (x: ItemType) => ItemKeyType
}

type ReturnType<ItemType, ItemKeyType> = {
    onPress: (x: ItemType) => void
    selected: Animated.SharedValue<ItemKeyType[]>
    onLongPress:  (x: ItemType) => void
    isSelectMode: Animated.SharedValue<boolean>
}

function useSelected<ItemType, ItemKeyType = ItemType>({
    onPress,
    onExit,
    onEnter,
    selectFn
}: Props<ItemType, ItemKeyType>): ReturnType<ItemType, ItemKeyType> {

    const selected = useSharedValue<ItemKeyType[]>([])
    const isSelectMode = useSharedValue<boolean>(false)

    function _getKey(item: ItemType): ItemKeyType {
        const key = selectFn ? selectFn(item) : item
        return key as ItemKeyType
    }

    function onLongPress(item: ItemType) {
        if(isSelectMode.value)
            exitSelectMode()
        else 
            enterSelectMode(item)
    }

    function exitSelectMode(){
        selected.value = []
        isSelectMode.value = false
        if(onExit)
            onExit()
    }

    function enterSelectMode(item: ItemType){
        isSelectMode.value = true
        selected.value = [_getKey(item)]
        if(onEnter)
            onEnter()
    }

    function _onPress(item: ItemType) {
        if(isSelectMode.value){
            const key = _getKey(item)
            let arr
            if(selected.value.includes(key))
                arr = selected.value.filter((x) => x !== key)
            else
                arr = [...selected.value, key]
            selected.value = arr
            if(arr.length === 0)
                exitSelectMode()
        }
        else onPress(item)
    }

    return { selected, isSelectMode, onLongPress, onPress: _onPress }
}

export { useSelected }