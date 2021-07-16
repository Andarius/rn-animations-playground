import { scaleLinear } from 'd3-scale'
import * as shape from 'd3-shape'

export type Config = {
    minX?: number
    maxX?: number
    minY?: number
    maxY?: number
    // See https://github.com/d3/d3-shape#curves
    curve?: shape.CurveFactory | shape.CurveFactoryLineOnly
}

export const buildGraph = (
    data: [number, number][],
    width: number,
    height: number,
    config?: Config
) => {
    const minX = Math.min(...data.map((x) => x[0]))
    const maxX = Math.max(...data.map((x) => x[0]))
    const scaleX = scaleLinear()
        .domain([config?.minX ?? minX, config?.maxX ?? maxX])
        .range([0, width])

    const minY = Math.min(...data.map((x) => x[1]))
    const maxY = Math.max(...data.map((x) => x[1]))
    const scaleY = scaleLinear()
        .domain([config?.minY ?? minY, config?.maxY ?? maxY])
        .range([height, 0])

    const fmtValues = data.map((x) => [x[1], x[0]] as [number, number])

    const path = shape
        .line()
        .x(([, x]) => scaleX(x))
        .y(([y]) => scaleY(y))
        .curve(config?.curve ?? shape.curveLinear)(fmtValues) as string

    return {
        data: fmtValues,
        minY,
        maxY,
        minX,
        maxX,
        path
    }
}
export type GraphData = ReturnType<typeof buildGraph>
