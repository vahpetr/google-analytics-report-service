FROM node:10.7.0-alpine as builder

WORKDIR /app

ADD package.json package-lock.json ./

ENV NPM_CONFIG_LOGLEVEL=error \
    NODE_ENV=production \
    BABEL_ENV=production \
    GENERATE_SOURCEMAP=false \
    GENERATE_ANALYSISMAP=false

RUN npm install --production
RUN npm audit fix
COPY . .
RUN npm test
RUN npm run prod:bundle

FROM node:10.7.0-alpine
WORKDIR /app/bundle
COPY --from=builder /app/bundle/server.js .
EXPOSE 3000 5500
CMD [ "node", "server.js" ]
