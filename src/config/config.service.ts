import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
    public getExpiresIn = () => Number(process.env.EXPIRES_IN);
    public getSecretOrKey = () => process.env.SECRET_OR_KEY || "";
    public getBILogin = () => process.env.BI_LOGIN || "";
    public getBIPass = () => process.env.BI_PASS || "";
    public isAuthEnabled = () => process.env.ENABLE_AUTH === "1";
}
