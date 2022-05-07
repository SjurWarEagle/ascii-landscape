#########
# STAGE #
#########
FROM node:18.1.0 as buildstage

RUN apt update -y && \
    apt install -y --no-install-recommends --no-install-suggests \
    nginx \
    ca-certificates &&\
    rm -rf /var/cache/apt/ &&\
    rm -rf /var/lib/apt/lists/*
RUN mkdir -p /project/server/src/
RUN mkdir -p /project/client/src/

#Server
COPY ./server/src /project/server/src
COPY ./server/package.json /project/server
COPY ./server/package-lock.json /project/server
COPY ./server/LICENSE /project/server
COPY ./server/.eslintrc.js /project/server
COPY ./server/tsconfig.json /project/server
COPY ./server/tsconfig.build.json /project/server

#Client
COPY ./client/src /project/client/src
COPY ./client/package.json /project/client
COPY ./client/package-lock.json /project/client
COPY ./client/LICENSE /project/client
COPY ./client/.eslintrc.js /project/client
COPY ./client/tsconfig.json /project/client
COPY ./client/tsconfig.build.json /project/client

WORKDIR /project/server
RUN npm install
RUN npm run lint
RUN npm run build

WORKDIR /project/client
RUN npm install
RUN npm run lint
RUN npm run build

#########
# STAGE #
#########
FROM node:18.1.0
RUN mkdir -p /project
WORKDIR /project
COPY --from=buildstage /project/dist /project/dist


# COPY ./dist /project/dist
COPY ./src /project/src
COPY ./package.json /project
COPY ./package-lock.json /project
COPY ./LICENSE /project
COPY ./.eslintrc.js /project
COPY ./tsconfig.json /project

RUN npm install  --omit=dev
CMD ["node", "dist/main"]
