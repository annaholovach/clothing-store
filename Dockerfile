FROM registry.hub.docker.com/library/node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 5000

CMD [ "npm", "run", "start:dev" ]