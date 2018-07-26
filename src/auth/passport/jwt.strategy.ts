import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { use } from "passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { SignedUser } from "src/auth/auth.contract";
import { AuthService } from "src/auth/auth.service";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class JwtStrategy extends Strategy {
    constructor(
        private readonly authService: AuthService,
        configService: ConfigService
    ) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
                secretOrKey: configService.getSecretOrKey()
            },
            async (req, payload, next) => this.verify(req, payload, next)
        );
        use(this);
    }

    public async verify(
        _: Request,
        signedUser: SignedUser,
        done: VerifiedCallback
    ): Promise<void> {
        const isValid = await this.authService.validateUser(signedUser);
        if (!isValid) {
            return done(
                {
                    error: {
                        message: "Unauthorized."
                    }
                },
                false
            );
        }
        done(null, signedUser);
    }
}
