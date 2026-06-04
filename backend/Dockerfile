# Stage 1 — build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src ./src
RUN npm run build

# Stage 2 — produção
FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

RUN mkdir -p data uploads/vehicles uploads/vehiclesSold uploads/logos uploads/icons \
    uploads/bannersAbout uploads/bannersMain uploads/bannersInstagram uploads/clientes

EXPOSE 3001
CMD ["node", "dist/server.js"]
