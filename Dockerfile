# Build stage
FROM public.ecr.aws/docker/library/node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
ENV NODE_ENV=development

COPY . .
RUN npm run build

# Runtime stage
FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/infra/config/env/production.env ./src/infra/config/env/production.env
COPY --from=build /app/package.json ./

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
