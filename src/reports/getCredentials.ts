import { authenticate } from "src/reports/authenticate";

(async () => {
    const scopes = ["https://www.googleapis.com/auth/analytics.readonly"];
    const auth = await authenticate({ scopes });
    // tslint:disable-next-line:no-console
    console.log(auth);
})();
