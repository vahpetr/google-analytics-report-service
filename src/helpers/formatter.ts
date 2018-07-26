export function pad(value: number): string {
    const str = String(value);
    if (str.length === 1) {
        return `0${str}`;
    }
    return str;
}

export function dateToISOStringYYYYMMDD(date: Date): string {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )}`;
}
