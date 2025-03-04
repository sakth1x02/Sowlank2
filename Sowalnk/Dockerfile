FROM node:18-alpine AS builder
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm run build
CMD ["npn", "run", "dev"]