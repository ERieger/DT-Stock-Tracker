FROM node:alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only-production

COPY . .
EXPOSE 3000

ENTRYPOINT [ "node", "/app/src/app.js" ]
