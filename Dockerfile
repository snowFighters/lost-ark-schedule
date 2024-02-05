FROM node:18-alpine

RUN mkdir -p /app

WORKDIR /app

ADD . /app

RUN npm install

RUN npm run build


CMD ["npm", "start"]