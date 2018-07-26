import { createHmac } from "crypto";

export function sha256(text: string, secret: string = "publicSecret"): string {
    return createHmac("sha256", secret)
        .update(text)
        .digest("hex");
}
