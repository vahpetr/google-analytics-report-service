import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod
} from "@nestjs/common";
import { authenticate } from "passport";
import { AuthController } from "src/auth/auth.controller";
import { AuthService } from "src/auth/auth.service";
import { JwtStrategy } from "src/auth/passport/jwt.strategy";
import { ConfigModule } from "src/config/config.module";
import { ConfigService } from "src/config/config.service";

@Module({
    controllers: [AuthController],
    imports: [ConfigModule],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule implements NestModule {
    constructor(private readonly configService: ConfigService) {}

    public configure(consumer: MiddlewareConsumer): void {
        if (this.configService.isAuthEnabled()) {
            consumer
                .apply(authenticate("jwt", { session: false }))
                .forRoutes({
                    method: RequestMethod.ALL,
                    path: "/api/auth/authorized"
                });
        }
    }
}
