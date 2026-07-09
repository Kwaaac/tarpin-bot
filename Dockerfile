FROM node:22-alpine
LABEL authors="kwaaac"

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

CMD ["npm", "start"]