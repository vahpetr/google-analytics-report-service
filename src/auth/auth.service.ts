// https://gist.github.com/zmts/802dc9c3510d79fd40f9dc38a12bccfc

import { BadRequestException, Injectable } from "@nestjs/common";
import { sign } from "jsonwebtoken";
import {
    AuthDto,
    AuthUser,
    SignedUser,
    UserEntity
} from "src/auth/auth.contract";
import { ConfigService } from "src/config/config.service";
import { AuthorizationRequest } from "src/decorators/authorization.decorator";

@Injectable()
export class AuthService {
    public users: UserEntity[] = [];

    constructor(private readonly configService: ConfigService) {
        this.users.push({
            login: this.configService.getBILogin(),
            pass: this.configService.getBIPass()
        });
    }

    public async createToken(
        authorization: AuthorizationRequest
    ): Promise<AuthDto> {
        if (!authorization) {
            throw new BadRequestException("Miss authorization.");
        }

        if (!authorization.login) {
            throw new BadRequestException("Miss authorization login");
        }

        if (!authorization.pass) {
            throw new BadRequestException("Miss authorization pass");
        }

        const user = this.users.find(p => p.login === authorization.login);
        if (!user) {
            throw new BadRequestException("Incorrect authorization");
        }

        if (user.pass !== authorization.pass) {
            throw new BadRequestException("Incorrect authorization");
        }

        const authUser: AuthUser = {
            identity: authorization.login
        };
        const secretOrKey = this.configService.getSecretOrKey();
        const expiresIn = this.configService.getExpiresIn();
        const accessToken = sign(authUser, secretOrKey, {
            expiresIn
        });

        return {
            accessToken,
            expires_in: expiresIn
        };
    }

    public async validateUser(signedUser: SignedUser): Promise<boolean> {
        if (!signedUser) {
            return false;
        }

        if (!signedUser.identity) {
            return false;
        }

        const currentTime = new Date();
        const expiryTime = new Date(signedUser.exp * 1000);
        if (expiryTime <= currentTime) {
            return false;
        }

        const user = this.users.find(p => p.login === signedUser.identity);

        if (!user) {
            return false;
        }

        // put some validation logic here
        // for example query user by id / email / username

        return true;
    }
}
