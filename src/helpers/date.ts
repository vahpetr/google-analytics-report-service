export function addMs(date: Date, ms: number): Date {
    const newDate = new Date(date);
    newDate.setTime(date.getTime() + ms);
    return newDate;
}
