FROM node:20-alpine3.17

#copy server-dir
COPY . node_server

#cd node_server
WORKDIR /node_server

#install npm
RUN npm install -g npm@9.7.1

RUN npm i .

EXPOSE 5050

ENTRYPOINT [ "node", "app.js" ]