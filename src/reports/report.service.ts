import { Injectable } from "@nestjs/common";
import { google } from "googleapis";
import { Parser } from "json2csv";
import { sha256 } from "src/helpers/hash";
import { authenticate } from "src/reports/authenticate";
import {
    SimpleReportRequest,
    SimpleReportsResponse
} from "src/reports/report.contract";
import { ReportFilter } from "src/reports/report.filter";

@Injectable()
export class ReportService {
    public getCsvReport = (filter: ReportFilter, report: SimpleReportsResponse) => {
        const table = this.getTable(report);
        if (!table) {
            return {
                data: "",
                fileName: "empty"
            };
        }

        const options = {
            delimiter: ";",
            fields: table.fields,
            withBOM: true
        };
        const parser = new Parser(options);
        const data = parser.parse(table.values);
        const fileName = this.createFileName(filter);

        return {
            data,
            fileName
        };
    };

    public getJsonReport = async (
        filter: ReportFilter
    ): Promise<SimpleReportsResponse> => {
        const auth = await this.getAuth();
        const api = google.analyticsreporting({
            auth,
            version: "v4"
        });
        const request = this.createRequest(filter);
        const batchGetResponse = await api.reports.batchGet({
            requestBody: {
                reportRequests: [request]
            }
        });
        let data = batchGetResponse.data as SimpleReportsResponse;
        const result = data;

        // load all data
        while (data.reports[0].nextPageToken) {
            request.pageToken = data.reports[0].nextPageToken;
            const batchGetNextResponse = await api.reports.batchGet(
                {
                    requestBody: {
                        reportRequests: [request]
                    }
                }
            );
            data = batchGetNextResponse.data as SimpleReportsResponse;
            result.reports[0].data.rows.push(...data.reports[0].data.rows);
        }

        delete result.reports[0].nextPageToken;

        return result;
    };

    private createRequest = (filter: ReportFilter) => {
        const { viewId, samplingLevel } = filter;
        const dateRanges = [
            {
                endDate: filter.endDate.trim(),
                startDate: filter.startDate.trim()
            }
        ];
        const metrics = filter.metrics
            .split(",")
            .map(expression => ({ expression: expression.trim() }));
        const request: SimpleReportRequest = {
            dateRanges,
            metrics,
            pageSize: 1000000, // real google max 10000
            samplingLevel: samplingLevel.trim(),
            viewId: viewId.trim()
        };

        if (filter.dimensions.trim()) {
            const dimensions = filter.dimensions
                .split(",")
                .map(name => ({ name: name.trim() }));
            request.dimensions = dimensions;
        }

        const segmentId = filter.segmentId.trim();
        if (segmentId) {
            request.segments = [{ segmentId }];
        }

        return request;
    };

    private getAuth = async () => {
        const scopes = ["https://www.googleapis.com/auth/analytics.readonly"];
        return await authenticate({ scopes });
    };

    private getTable = (response: SimpleReportsResponse) => {
        if (!response.reports.length) {
            return null;
        }

        const report = response.reports[0];
        const dimensionFields = report.columnHeader.dimensions.map(
            dimension => dimension
        );
        const metricFields = report.columnHeader.metricHeader.metricHeaderEntries.map(
            metric => metric.name
        );
        const values: Array<{}> = [];

        for (const row of report.data.rows) {
            const value = {};

            const dimensions = row.dimensions;
            for (let i = 0, l = dimensions.length; i < l; i++) {
                value[dimensionFields[i]] = dimensions[i];
            }

            const metrics = row.metrics[0].values;
            for (let i = 0, l = metrics.length; i < l; i++) {
                value[metricFields[i]] = metrics[i];
            }

            values.push(value);
        }

        const fields = dimensionFields.concat(metricFields);

        return {
            fields,
            values
        };
    };

    private createFileName = (filter: ReportFilter) => {
        const filterString = JSON.stringify(filter);
        const hash = sha256(filterString);
        return `${hash}`;
    };
}
