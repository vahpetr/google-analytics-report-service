import { Module } from "@nestjs/common";
import { ConfigService } from "src/config/config.service";

@Module({
    exports: [ConfigService],
    providers: [ConfigService]
})
export class ConfigModule {}
