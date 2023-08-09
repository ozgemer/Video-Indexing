FROM node:20-alpine3.17

#copy front-dir
COPY . front

WORKDIR /front

RUN npm install -g npm@9.7.1

RUN npm i . --force

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]