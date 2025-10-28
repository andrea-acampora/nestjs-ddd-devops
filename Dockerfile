FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run schema:update && npm run migrate:up && npm run start:prod"]