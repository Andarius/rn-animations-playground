/**
 * Taken from https://github.com/d3/d3-path/blob/main/src/path.js
 */
import { useSharedValue } from 'react-native-reanimated'

const TAU = 2 * Math.PI
const EPSILON = 1e-6
const TAU_EPSILON = TAU - EPSILON

const usePath = function () {
    const _x0 = useSharedValue<number | null>(null)
    const _y0 = useSharedValue<number | null>(null)
    const _x1 = useSharedValue<number | null>(null)
    const _y1 = useSharedValue<number | null>(null)

    const path = useSharedValue<string>('')

    const moveTo = function (x: number, y: number) {
        'worklet'
        _x0.value = x
        _x1.value = x

        _y0.value = y
        _y1.value = y
        path.value += `M${x},${y}`
    }

    const closePath = function () {
        'worklet'
        if (_x1.value !== null) {
            _x1.value = _x0.value
            _y1.value = _y0.value
            path.value += 'Z'
        }
    }

    const lineTo = function (x: number, y: number) {
        'worklet'
        _x1.value = x
        _y1.value = y
        path.value += `L${x},${y}`
    }

    const quadraticCurveTo = function (
        x1: number,
        y1: number,
        x: number,
        y: number
    ) {
        'worklet'
        _x1.value = x
        _y1.value = y
        path.value += `Q${x1},${y1},${x},${y}`
    }

    const bezierCurveTo = function (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x: number,
        y: number
    ) {
        'worklet'
        _x1.value = x
        _y1.value = y
        path.value += `C${x1},${y1},${x2},${y2},${x},${y}`
    }

    const arcTo = function (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        r: number
    ) {
        'worklet'
        _x1.value = x1
        _y1.value = y1

        const x0 = _x1.value
        const y0 = _y1.value
        const x21 = x2 - x1
        const y21 = y2 - y1
        const x01 = x0 - x1
        const y01 = y0 - y1
        const l01_2 = x01 * x01 + y01 * y01

        // Is the radius negative? Error.
        if (r < 0) throw new Error('negative radius: ' + r)

        // Is this path empty? Move to (x1,y1).
        if (_x1.value === null) {
            _x1.value = x1
            _y1.value = y1
            path.value += `M${x1},${y1}`
        }

        // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
        else if (!(l01_2 > EPSILON)) {
        } else if (!(Math.abs(y01 * x21 - y21 * x01) > EPSILON) || !r) {
            // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
            // Equivalently, is (x1,y1) coincident with (x2,y2)?
            // Or, is the radius zero? Line to (x1,y1).
            _x1.value = x1
            _y1.value = y1
            path.value += `L${x1},${y1}`
        }
        // Otherwise, draw an arc!
        else {
            const x20 = x2 - x0
            const y20 = y2 - y0
            const l21_2 = x21 * x21 + y21 * y21
            const l20_2 = x20 * x20 + y20 * y20
            const l21 = Math.sqrt(l21_2)
            const l01 = Math.sqrt(l01_2)
            const l =
                r *
                Math.tan(
                    (Math.PI -
                        Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) /
                        2
                )
            const t01 = l / l01
            const t21 = l / l21

            // If the start tangent is not coincident with (x0,y0), line to.
            if (Math.abs(t01 - 1) > EPSILON) {
                path.value += `L${x1 + t01 * x01},${y1 + t01 * y01}`
            }
            _x1.value = x1 + t21 * x21
            _y1.value = y1 + t21 * y21
            path.value += `A${r},${r},0,0,${y01 * x20 > x01 * y20},${
                _x1.value
            },${_y1.value}`
        }
    }

    const arc = function (
        x: number,
        y: number,
        r: number,
        a0: number,
        a1: number,
        ccw: number
    ) {
        'worklet'
        const dx = r * Math.cos(a0)
        const dy = r * Math.sin(a0)
        const x0 = x + dx
        const y0 = y + dy
        // eslint-disable-next-line no-bitwise
        const cw = 1 ^ ccw
        let da = ccw ? a0 - a1 : a1 - a0

        // Is the radius negative? Error.
        if (r < 0) throw new Error('negative radius: ' + r)

        // Is this path empty? Move to (x0,y0).
        if (_x1.value === null || _y1.value === null) {
            path.value += `M${x0},${y0}`
        }

        // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
        else if (
            Math.abs(_x1.value - x0) > EPSILON ||
            Math.abs(_y1.value - y0) > EPSILON
        ) {
            path.value += `L${x0},${y0}`
        }

        // Is this arc empty? We’re done.
        if (!r) return

        // Does the angle go the wrong way? Flip the direction.
        if (da < 0) da = (da % TAU) + TAU

        // Is this a complete circle? Draw two arcs to complete the circle.
        if (da > TAU_EPSILON) {
            _x1.value = x0
            _y1.value = y0
            path.value += `A${r},${r},0,1,${cw},${x - dx},${
                y - dy
            },A,${r},${r},0,1,${cw},${x0},${y0}`
        }

        // Is this arc non-empty? Draw an arc!
        else if (da > EPSILON) {
            _x1.value = x + r * Math.cos(a1)
            _y1.value = y + r * Math.sin(a1)
            path.value += `A${r},${r},0,${da >= Math.PI ? 1 : 0},${cw},${
                _x1.value
            },${_y1.value}`
        }
    }

    const rect = function (x: number, y: number, w: number, h: number) {
        'worklet'
        _x0.value = x
        _x1.value = x
        _y0.value = y
        _y1.value = y
        path.value += `M${x},${y},h,${w},v,${h},${-w},Z`
    }

    return {
        moveTo,
        closePath,
        lineTo,
        quadraticCurveTo,
        bezierCurveTo,
        arcTo,
        arc,
        rect,
        path
    }
}

export type D3Path = ReturnType<typeof usePath>

export { usePath }
