import { addMs } from "src/helpers/date";
import { dateToISOStringYYYYMMDD } from "src/helpers/formatter";

export class ReportFilter {
    public readonly viewId: string = "159681534";
    public readonly endDate: string = "yesterday";
    public readonly startDate: string = "yesterday";
    public readonly metrics: string = "ga:sessions,ga:users";
    // https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#Segment
    public readonly segmentId: string = "";
    // https://developers.google.com/analytics/devguides/reporting/core/v4/basics#sampling
    public readonly samplingLevel: string = "DEFAULT";
    public readonly dimensions: string = "ga:date,ga:city";
    public readonly format: string = "json";

    constructor() {
        const currentDate = new Date();
        // eq yesterday | YYYY-MM-DD
        this.startDate = dateToISOStringYYYYMMDD(
            addMs(currentDate, 24 * 60 * 60 * 1000 * -1)
        );
        // eq yesterday | YYYY-MM-DD
        this.endDate = dateToISOStringYYYYMMDD(
            addMs(currentDate, 24 * 60 * 60 * 1000 * -1)
        );
    }
}
