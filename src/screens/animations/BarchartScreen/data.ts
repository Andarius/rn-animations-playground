import { DataItem } from './Barchart'

const BARCHART_HEIGHT = 200

export const DATA: DataItem[] = [
    {
        'value': 204633,
        'label': 'Mai'
    },
    {
        'value': 195234,
        'label': 'Ju.'
    },
    {
        'value': 436693,
        'label': 'Jui'
    },
    {
        'value': 164580,
        'label': 'Ao.'
    },
    {
        'value': 151261,
        'label': 'Se.'
    },
    {
        'value': 207015,
        'label': 'Oc.'
    },
    {
        'value': 43098,
        'label': 'No.'
    }
]

type Config = {
    data: DataItem[]
    animate: boolean
    maxHeight: number
    normalize?: boolean
    minValue?: number
    maxValue?: number
    minHeight?: number
    minNormValue?: number
}

const CONFIG_1 = {
    data: DATA,
    animate: true,
    maxHeight: BARCHART_HEIGHT,
    minNormValue: 0
}

const DATA2: DataItem[] = [
    { label: '', value: 80.51 },
    { label: '', value: 80.45 },
    { label: '', value: 80.21 },
    { label: '', value: 80.38 },
    { label: '', value: 79.53 }
]

export const CONFIG_2 = {
    data: DATA2,
    animate: false,
    normalize: false,
    minValue: Math.min(...DATA2.map((x) => x.value)),
    maxValue: Math.max(...DATA2.map((x) => x.value)),
    maxHeight: 50,
    minHeight: 50 / 2,
}

export const CONFIG: Config = CONFIG_1
