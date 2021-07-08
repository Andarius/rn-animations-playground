import { Colors } from '@src/theme'
import { makeMutable } from 'react-native-reanimated'
import { LineItem } from './Linechart'

type Item = {
    ts: number
    speed: number
    bpm: number
    distance: number
    altitude: number
    power: number
}

const DATASET_1 = [
    { x: 0, y: 0 },
    { x: 1, y: 2 },
    { x: 2, y: 7 }
]

const DATASET_2 = [
    { x: 0, y: 7 },
    { x: 1, y: 2 },
    { x: 2, y: 0 }
]

const TEST_DATA: Item[] = require('./data.json')
const BPM_DATA = TEST_DATA.map((x) => ({ ts: x.ts, value: x.bpm }))

export type DataSet = LineItem & { name: string }
export const GRAPHS: DataSet[] = [
    {
        name: 'dataset-1',
        data: DATASET_1,
        currentValue: makeMutable<number>(0),
        color: Colors.primary
    },
    {
        name: 'dataset-2',
        data: DATASET_2,
        currentValue: makeMutable<number>(0),
        color: Colors.tertiary
    },
    {
        name: 'dataset-3',
        data: TEST_DATA.map((x) => ({ x: x.ts, y: x.bpm })),
        currentValue: makeMutable<number>(0),
        color: Colors.secondary,
        config: {
            minY: Math.min(...BPM_DATA.map((x) => x.value)) - 20,
            maxY: Math.max(...BPM_DATA.map((x) => x.value)) + 20
        }
    }
]
