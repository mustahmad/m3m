FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/backend/package.json packages/backend/
COPY packages/frontend/package.json packages/frontend/

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["npx", "tsx", "packages/backend/src/index.ts"]
