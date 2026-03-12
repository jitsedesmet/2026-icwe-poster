FROM node AS builder
WORKDIR /app/web

COPY package.json package-lock.json ./

RUN npm install

COPY . .
RUN npm run build -- --base='/'


FROM httpd:2 AS runner

COPY --from=builder /app/web/dist /usr/local/apache2/htdocs
