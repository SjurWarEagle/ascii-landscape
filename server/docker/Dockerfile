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
RUN mkdir -p /project
RUN mkdir -p /project/public/
RUN mkdir -p /project/src/

#COPY ./public /project/public
COPY ./src /project/src
COPY ./package.json /project
COPY ./package-lock.json /project
COPY ./LICENSE /project
COPY ./.eslintrc.js /project
COPY ./tsconfig.json /project
COPY ./tsconfig.build.json /project

WORKDIR /project

#RUN npm install -g parcel-bundler

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
