import { Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "src/auth//auth.service";
import { AuthDto } from "src/auth/auth.contract";
import {
    Authorization,
    AuthorizationRequest
} from "src/decorators/authorization.decorator";

@Controller("api/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("token")
    @HttpCode(HttpStatus.OK)
    public async getToken(
        @Authorization() authorization: AuthorizationRequest
    ): Promise<AuthDto> {
        return this.authService.createToken(authorization);
    }

    @Get("authorized")
    public authorized(): string {
        return "Authorized.";
    }
}
