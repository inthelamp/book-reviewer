# pull official base image
FROM node:16.13.0-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

COPY package-lock.json ./

RUN npm install

# Bundle app source
COPY . ./

EXPOSE 5000

CMD [ "node", "server.js" ]