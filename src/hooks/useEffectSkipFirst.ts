/* eslint-disable react-hooks/exhaustive-deps */
import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

/**
 * useEffect that skips the first render
 */
const useEffectSkipFirst = function(
    effect: EffectCallback, deps?: DependencyList
) {

    const _firstRender = useRef<boolean>(true)
    useEffect(() => {
        if (_firstRender.current === false)
            effect()
        else
            _firstRender.current = false
    }, deps)
}

export { useEffectSkipFirst }


