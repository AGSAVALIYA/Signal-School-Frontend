# Web app: built once with Vite, served by nginx, which also forwards /api and /files to the API container.
# docker build -t signal-school-web .   (API_UPSTREAM defaults to http://api:3000, the compose service name)

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Empty = the API is reached on the same origin under /api (through this nginx).
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.27-alpine
ENV API_UPSTREAM=http://api:3000
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s CMD wget -qO /dev/null http://127.0.0.1/healthz || exit 1
