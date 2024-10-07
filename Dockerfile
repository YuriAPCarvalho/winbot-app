FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY .env ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "server.js"]
