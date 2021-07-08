import { useLinearCurve } from './d3Curves'
import { usePath } from './d3Path'



// const COLORS = new Map([
//     [0, '#EFF7CF'],
//     [1, '#BAD9B5'],
//     [2, '#ABA361'],
//     [3, '#732C2C']
// ])


type DataItem = [number, number]

type ScaleX = (d: number, index: number, data: DataItem[]) => number
type ScaleY = (d: number, index: number, data: DataItem[]) => number
const useLine = function (data: DataItem[], scaleX: ScaleX, scaleY: ScaleY) {
    const path = usePath()
    const curve = useLinearCurve(path)

    const getLine = function () {
        curve.lineStart()
        for (let i = 0; i < data.length; i++) {
            curve.point(
                scaleX(data[i][0], i, data),
                scaleY(data[i][1], i, data)
            )
        }
        curve.lineEnd()

        return path.path.value
    }

    return { getLine }
}

export { useLine }
