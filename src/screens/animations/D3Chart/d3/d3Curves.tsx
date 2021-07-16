/**
 * https://github.com/d3/d3-shape/blob/005b0e4a12adf6a1039df2bef84bdc8541e34c88/src/curve/linear.js
 */
import { useSharedValue } from 'react-native-reanimated'
import { D3Path } from './d3Path'

const useLinearCurve = function (path: D3Path) {
    const _line = useSharedValue<number>(0)
    const _point = useSharedValue<number>(0)

    const areaStart = function () {
        _line.value = 0
    }
    const areaEnd = function () {
        _line.value = NaN
    }
    const lineStart = function () {
        _point.value = 0
    }
    const lineEnd = function () {
        if (_line.value || (_line.value !== 0 && _point.value === 1))
            path.closePath()
        if (_line.value === null) throw new Error('Got empty line on "lineEnd"')
        _line.value = 1 - _line.value
    }

    const point = function (x: number, y: number) {
        console.log(path.path)
        switch (_point.value) {
            case 0:
                _point.value = 1
                if (_line.value) path.lineTo(x, y)
                else path.moveTo(x, y)
                break

            case 1:
                _point.value = 2 // falls through
            default:
                path.lineTo(x, y)
                break
        }
    }

    return { lineStart, lineEnd, point, areaStart, areaEnd }
}

export { useLinearCurve }
