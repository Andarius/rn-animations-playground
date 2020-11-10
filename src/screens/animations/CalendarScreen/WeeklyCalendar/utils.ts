/**
 * Get the first date of the week (monday)
 * @param d a date
 */
export const getMonday = function (d: Date) {
    const newDate = new Date(d)
    var day = newDate.getDay(),
        diff = newDate.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday

    return new Date(newDate.setDate(diff))
}

/**
 * Get the day at +days after date
 * @param date the date to start from
 * @param days nb days before/after date
 */
export const addDays = function (date: Date | string, days: number): Date {
    let result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

export const getPreviousMonday = function (d: Date) {
    return getMonday(addDays(getMonday(d), -1))
}

export const getNextMonday = function(d: Date){
    return getMonday(addDays(getMonday(d), 7))
}

export const getPreviousWeek = function(d: Date){
    return getWeekDays(getPreviousMonday(d))
}

export const getNextWeek = function(d: Date){
    return getWeekDays(getNextMonday(d))
}



/**
 * Returns all the dates of the `date` week, starting from monday
 */
export const getWeekDays = function (date: Date) {
    const monday = getMonday(date)
    return [...Array(7).keys()].map((x) => addDays(monday, x))
}

export function pad(n: string | number, width: number, z?: string) {
    z = z || '0'
    n = n + ''
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

export const getDate = function (date: Date): string {
    // Note: pb with isoString => converts to UTC
    // return date.toISOString().split('T')[0]
    return `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}`
}
