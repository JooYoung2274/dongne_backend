FROM node:18-alpine

RUN mkdir -p /var/app
WORKDIR /var/app

COPY package*.json ./
COPY .env ./
RUN npm install
RUN npm install -g pm2

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "dist/main.js"]


