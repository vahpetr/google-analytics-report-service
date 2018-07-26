# google-analytics-report-service

Google analytics report service.

## Install

1. Create google analytics web `key.json`. Set a redirect URL to `http://localhost:5500/oauth2callback`.
1. Create `secrets` directory in the project root. `mkdir secrets'.
1. Rename `client_secret_*.json` to `key.json` and move key to `secrets` folder.
1. Add read-only permission to access on your Google account.
1. Run authorization script and select your Google account.

    ```bash
    npm run get:credentials
    ```
> Script must create 'credentials.json' in `secrets` folder.

## Run

```bash
docker-compose up --build
```

## How use (example)

### Without authorization (default in docker)

```bash
curl 'http://localhost:3000/api/reports?dimensions=ga:date,ga:city&metrics=ga:sessions,ga:users&format=csv' --output report.csv
```

Available query params:

1. viewId - default value 159681534
1. startDate - default value empty (yesterday) (ISO 8601). example: YYYY-MM-DD
1. endDate - default value empty (yesterday) (ISO 8601). example: YYYY-MM-DD
1. metrics - default value ga:sessions,ga:users
1. dimensions - default value ga:date
1. segmentId - default value empty
1. samplingLevel - default value [DEFAULT](https://developers.google.com/analytics/devguides/reporting/core/v4/basics#sampling)

Support [basics](https://developers.google.com/analytics/devguides/reporting/core/v4/basics) api:

Not supported params:

1. multiple startDate, endDate
1. metricFilterClauses
1. dimensionFilterClauses
1. histogramBuckets
1. orderBys
1. dynamicSegment

### With authorization

1. Get authorization

    ```bash
    curl -X POST http://localhost:3000/api/auth/token -u login:pass

    # example response
    # {
    #   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6ImJ1c2luZXNzLWludGVsbGlnZW5jZSIsImlhdCI6MTUzMjA3NDk4OSwiZXhwIjoxNTMyMDc4NTg5fQ.T16vEMHASagNfRPZtN2nNWTcr1OnNQ0YYXr8Ry8Gqd8",
    #   "expires_in": 3600
    # }
    ```

1. Get csv report

    ```bash
    curl 'http://localhost:3000/api/reports?dimensions=ga:date,ga:city&metrics=ga:sessions,ga:users&startDate=2018-07-14&endDate=2018-07-20&format=csv' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6ImJ1c2luZXNzLWludGVsbGlnZW5jZSIsImlhdCI6MTUzMjA3NDk4OSwiZXhwIjoxNTMyMDc4NTg5fQ.T16vEMHASagNfRPZtN2nNWTcr1OnNQ0YYXr8Ry8Gqd8' --output report.csv
    ```

## ENV

1. EXPIRES_IN                   -   3600
1. SECRET_OR_KEY                -   xxx
1. BI_LOGIN                     -   xxx
1. BI_PASS                      -   xxx
1. ENABLE_AUTH                  -   1

## Documentation

1. https://developers.google.com/analytics/devguides/reporting/core/v4/basics
1. https://developers.google.com/analytics/devguides/reporting/core/v4/advanced
1. https://developers.google.com/analytics/devguides/reporting/core/dimsmets
1. https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet
1. https://developers.google.com/analytics/devguides/reporting/core/v4/basics#segment_id
1. [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.


## TODO

1. Add cache
1. Add filter validator

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run dev

# development watch
npm run dev:watch

# production
npm run prod

# production bundle
npm run prod:bundle

# production bundle analys
npm run prod:bundle:analys
```

## Test

```bash
# unit tests
npm run test

# test coverage
npm run test:cov
```
