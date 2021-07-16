export type WeightItem = {
    date: string
    weight: number
    body_fat: number | null
}

const WEIGHT_DATA: WeightItem[] = require('./weight.json')

const WEIGHT = WEIGHT_DATA.filter((x) => x.weight !== null).map(
    (x) => [new Date(x.date).getTime(), x.weight] as [number, number]
)

const BODY_FAT = WEIGHT_DATA.filter((x) => x.body_fat !== null).map(
    (x) => [new Date(x.date).getTime(), x.body_fat] as [number, number]
)

export { WEIGHT_DATA, WEIGHT, BODY_FAT }
