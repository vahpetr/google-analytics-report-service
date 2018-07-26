import { BadRequestException, createParamDecorator } from "@nestjs/common";
import { atob } from "src/helpers/atob";

export interface AuthorizationRequest {
    login: string;
    pass: string;
}

export const Authorization = createParamDecorator((_, req: Request): AuthorizationRequest => {
    // tslint:disable-next-line:no-string-literal
    const authorization = req.headers["authorization"];

    if (!authorization) {
        throw new BadRequestException("Incorrect authorization");
    }

    const parts = authorization.split(" ");
    if (parts.length !== 2) {
        throw new BadRequestException("Miss authorization");
    }

    const user = atob(parts[1]);

    const [login, pass] = user.split(":");

    if (!login) {
        throw new BadRequestException("Miss authorization login");
    }

    if (!pass) {
        throw new BadRequestException("Miss authorization pass");
    }

    return {
        login,
        pass
    };
});
