import {
    access as fsAccess,
    constants as fsConstants,
    readFile as fsReadFile,
    writeFile as fsWriteFile
} from "fs";
import { google } from "googleapis";
import { createServer } from "http";
import opn = require("opn");
import { join as pathJoin } from "path";
import { parse as querystringParse } from "querystring";
import { GoogleOauth2WebKeys } from "src/reports/report.contract";
import { parse as urlParse } from "url";
import { GetTokenOptions, OAuth2Client } from "../../node_modules/google-auth-library/build/src/auth/oauth2client";

function getKeysPath(): string {
    return pathJoin(__dirname, "..", "..", "secrets", "key.json");
}

function getCredentialsPath(): string {
    return pathJoin(__dirname, "..", "..", "secrets", "credentials.json");
}

const exists = (filepath: string) => {
    return new Promise((resolve, _) => {
        fsAccess(filepath, fsConstants.F_OK, err => {
            if (err && err.code === "ENOENT") {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};

const writeFile = (filepath: string, data: {}, opts = "utf8") =>
    new Promise((resolve, reject) => {
        fsWriteFile(filepath, data, opts, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

const readFile = (filepath: string, opts = "utf8"): Promise<string> =>
    new Promise((resolve, reject) => {
        fsReadFile(filepath, opts, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

async function getCredentials(): Promise<{}> {
    const credentialsPath = getCredentialsPath();
    const json = await readFile(credentialsPath);
    return JSON.parse(json);
}

async function getKeys(): Promise<GoogleOauth2WebKeys> {
    const keyPath = getKeysPath();
    const json = await readFile(keyPath);
    return JSON.parse(json);
}

const port = 5500;

export const getClient = async () => {
    const keys = await getKeys();
    const redirectUrl = `${keys.web.redirect_uris[0]}`;
    const client = new google.auth.OAuth2(
        keys.web.client_id,
        keys.web.client_secret,
        redirectUrl
    );
    const credentialsPath = getCredentialsPath();
    const exsist = await exists(credentialsPath);
    if (exsist) {
        const credentials = await getCredentials();
        client.credentials = credentials;
    }
    return client;
};

export async function authenticate(options: {
    scopes: string[];
}): Promise<OAuth2Client> {
    const client = await getClient();
    if (client.credentials.access_token) {
        return client;
    }
    return new Promise<OAuth2Client>((resolve, reject) => {
        const server = createServer(async (req, res) => {
            try {
                if (req.url && req.url.indexOf("/oauth2callback") > -1) {
                    const request = urlParse(req.url);
                    if (request.query) {
                        const qs = querystringParse(request.query);
                        res.end(
                            "Authentication successful! Please return to the console."
                        );
                        server.close();
                        const tokenOptions = {
                            // tslint:disable-next-line:no-string-literal
                            code: qs["code"]
                        } as GetTokenOptions;
                        const { tokens } = await client.getToken(tokenOptions);
                        const credentialsString = JSON.stringify(
                            tokens,
                            null,
                            2
                        );
                        const credentialsPath = getCredentialsPath();
                        await writeFile(credentialsPath, credentialsString);
                        client.credentials = tokens;
                        resolve(client);
                    } else {
                        reject("Query undefined");
                    }
                } else {
                    reject("Url undefined");
                }
            } catch (ex) {
                reject(ex.message);
            }
        }).listen(port, () => {
            const authUrl = client.generateAuthUrl({
                access_type: "offline",
                prompt: "consent",
                scope: options.scopes.join(" ")
            });
            opn(authUrl, { wait: false }).then(cp => cp.unref());
        });
        // tslint:disable-next-line:no-commented-code
        // server.destroy();
    });
}
