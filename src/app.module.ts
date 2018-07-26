import { Module } from "@nestjs/common";
import { AppController } from "src/app.controller";
import { AuthModule } from "src/auth/auth.module";
import { ConfigModule } from "src/config/config.module";
import { ReportsController } from "src/reports/reports.controller";
import { ReportsModule } from "src/reports/reports.module";

@Module({
    controllers: [AppController, ReportsController],
    imports: [AuthModule, ConfigModule, ReportsModule]
})
export class AppModule {}
