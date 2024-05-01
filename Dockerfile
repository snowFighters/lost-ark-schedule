FROM node:18-alpine

WORKDIR /app

ADD . /app

RUN npm install

RUN npm run build


CMD ["npm", "start"]