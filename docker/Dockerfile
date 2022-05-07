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

WORKDIR /project/server
RUN npm install
RUN npm run lint
RUN npm run build

#Client
COPY ./client/src /project/client/src
COPY ./client/angular.json /project/client
COPY ./client/package.json /project/client
COPY ./client/package-lock.json /project/client
COPY ./client/LICENSE /project/client
COPY ./client/.eslintrc.json /project/client
COPY ./client/tsconfig.json /project/client
COPY ./client/tsconfig.app.json /project/client/

WORKDIR /project/client
RUN npm install
RUN npm run lint
RUN npm run build

#########
# STAGE #
#########
FROM node:18.1.0
RUN mkdir -p /project

COPY --from=buildstage /project/server/dist /project/server/dist
COPY --from=buildstage /project/client/dist /project/client/dist

RUN apt update -y && \
    apt install -y --no-install-recommends --no-install-suggests \
    nginx \
    ca-certificates &&\
    rm -rf /var/cache/apt/ &&\
    rm -rf /var/lib/apt/lists/*

COPY ./server/src /project/server/src
COPY ./server/package.json /project/server/
COPY ./server/package-lock.json /project/server/
COPY ./server/LICENSE /project/server/
COPY ./server/.eslintrc.js /project/server/
COPY ./server/tsconfig.json /project/server/

COPY ./client/angular.json /project/client
COPY ./client/package.json /project/client/
COPY ./client/package-lock.json /project/client/
COPY ./client/LICENSE /project/client/
COPY ./client/.eslintrc.json /project/client/
COPY ./client/tsconfig.json /project/client/
COPY ./client/tsconfig.app.json /project/client/

RUN rm -f /etc/nginx/conf.d/project.conf
RUN rm -rf /etc/apt/apt.conf.d/90nginx
COPY docker/nginx/nginx.conf /etc/nginx/sites-enabled/default
# COPY docker/nginx/nginx.conf /etc/nginx/conf.d/project.conf
COPY docker/scripts/start_all.sh /project

WORKDIR /project/server
RUN npm install  --omit=dev
#CMD ["node", "dist/main"]
STOPSIGNAL SIGTERM
CMD ["/bin/bash", "-c", "/project/start_all.sh"]
