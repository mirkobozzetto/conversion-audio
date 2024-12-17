FROM node:20-slim as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-slim as runner

WORKDIR /app

RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
