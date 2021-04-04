export const clamp = (
    value: number,
    lowerBound: number,
    upperBound: number
) => {
    'worklet';
    return Math.min(Math.max(lowerBound, value), upperBound);
}


export const round = (value: number, exponent: number) => {
    'worklet';
    const exp = 10 ** exponent
    return Math.round(value * exp) / exp
}
