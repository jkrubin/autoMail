# Dockerfile-fe
FROM node:14-alpine

WORKDIR /be

COPY package*.json ./

RUN npm install
RUN npm install -g ts-node

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
