FROM node:18-alpine

RUN mkdir -p /var/app
WORKDIR /var/app
RUN mkdir -p /dist

COPY package*.json ./
COPY .env ./
COPY dist ./dist
RUN npm install
RUN npm install -g pm2

EXPOSE 3000

CMD ["pm2-runtime", "dist/main.js"]


