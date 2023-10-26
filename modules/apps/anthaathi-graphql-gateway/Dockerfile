FROM node:20-alpine3.17 as build-stage

WORKDIR /usr/src/app

COPY /docker-build .

RUN yarn workspaces focus @anthaathi/graphql-gateway --production

FROM node:20-alpine3.17

WORKDIR /usr/src/app

USER node

COPY --chown=node --from=build-stage /usr/src/app /usr/src/app

LABEL org.opencontainers.image.source = "https://github.com/anthaathi/anthaathi-next"

COPY dist ./modules/apps/graphql-gateway/dist
COPY prisma ./modules/apps/graphql-gateway/prisma
COPY src/generated/client ./modules/apps/graphql-gateway/src/generated/client

ARG PRISMA_CLI_QUERY_ENGINE_TYPE="binary"
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=$PRISMA_CLI_QUERY_ENGINE_TYPE
ENV NODE_ENV=production

ENV PORT=3000

EXPOSE $PORT

CMD ["yarn", "workspace", "@anthaathi/graphql-gateway", "start:prod"]
