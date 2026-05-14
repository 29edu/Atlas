FROM node:20-alphine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5082

CMD ["node", "src/server.js"]



