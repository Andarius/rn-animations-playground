/**
 * Returns the symmetric difference of 2 arrays
 * Eg:
 *  a = [1, 2, 3] ; b = [2, 3, 4]
 *  getArrayDiff(a, b) => [1, 4]
 */
export const getArrayDiff = function <T>(a: T[], b: T[]): T[] {
    const [a1, a2] = [new Set(a), new Set(b)]
    return [...new Set([...a1].filter((x) => !a2.has(x)).concat(
        [...a2].filter((x) => !a1.has(x))
    ))]
}

/**
 * Returns the first matching element index from a given list
 */
export function getIndex<T>(data: T[], fn: (x: T) => boolean): number {
    for (let i = 0; i < data.length; i += 1){
        if (fn(data[i]))
            return i
    }
    return -1
}


export const normalizeValue = function (
    value: number,
    minValue: number,
    maxValue: number,
    defaultValue: number = 1
) {
    if (maxValue - minValue === 0) return defaultValue
    return (value - minValue) / (maxValue - minValue)
}
