FROM node:20 as base

WORKDIR /app

COPY . .

RUN npm install

COPY . .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait
RUN chmod +x /wait

FROM base as production

ENV NODE_PATH=./dist

RUN npm run build