import {
    BadRequestException,
    Controller,
    Get,
    Query,
    Response
} from "@nestjs/common";
import { Response as expressResponse } from "express";
import { ReportFilter } from "src/reports/report.filter";
import { ReportService } from "src/reports/report.service";

// TODO create decorator
const initFilter = (filter: ReportFilter) => {
    const defaultFilter = new ReportFilter();
    for (const key in defaultFilter) {
        if (!filter[key]) {
            filter[key] = defaultFilter[key];
        }
    }
};

@Controller("api/reports")
export class ReportsController {
    constructor(private readonly reportService: ReportService) {}

    @Get()
    public async get(
        @Query() filter: ReportFilter,
        @Response() res: expressResponse
    ): Promise<void> {
        initFilter(filter);

        try {
            if (filter.format === "json") {
                const report = await this.reportService.getJsonReport(filter);
                res.json(report);
            } else if (filter.format === "csv") {
                const report = await this.reportService.getJsonReport(filter);
                const csvReport = this.reportService.getCsvReport(
                    filter,
                    report
                );
                res.header(
                    "Content-Disposition",
                    `attachment;filename=${csvReport.fileName}.csv`
                );
                res.type("text/csv");
                res.send(csvReport.data);
            } else {
                throw new BadRequestException(
                    `Not supported format "${filter.format}".`
                );
            }
        } catch (ex) {
            throw new BadRequestException(ex.message);
        }
    }
}
