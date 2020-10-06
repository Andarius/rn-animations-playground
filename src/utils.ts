import { useRef } from 'react'

export const useUniqueID = function (initValue: number = 0) {
    const _counter = useRef<number>(initValue)
    function getID(prefix?: string) {
        const id: string = `${prefix}${_counter.current}`
        _counter.current += 1
        return id
    }

    return { getID }
}
