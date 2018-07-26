import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod
} from "@nestjs/common";
import { authenticate } from "passport";
import { ConfigModule } from "src/config/config.module";
import { ConfigService } from "src/config/config.service";
import { ReportService } from "src/reports/report.service";
import { ReportsController } from "src/reports/reports.controller";

@Module({
    controllers: [ReportsController],
    exports: [ReportService],
    imports: [ConfigModule],
    providers: [ReportService]
})
export class ReportsModule implements NestModule {
    constructor(private readonly configService: ConfigService) {}
    public configure(consumer: MiddlewareConsumer): void {
        if (this.configService.isAuthEnabled()) {
            consumer
                .apply(authenticate("jwt", { session: false }))
                .forRoutes({
                    method: RequestMethod.ALL,
                    path: "/api/reports"
                });
        }
    }
}
