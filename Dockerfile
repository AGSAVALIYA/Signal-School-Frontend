# Web app: built once with Vite, served by nginx as an unprivileged user on port 8080; nginx also forwards /api and
# /files to the API container.
#   docker build -t signal-school-web .   (API_UPSTREAM defaults to http://api:3000, the compose service name)
# Fast rebuilds: dependencies are a cached layer that only changes with package-lock.json, and npm's download cache
# survives between builds (BuildKit cache mount).

ARG NODE_IMAGE=node:22-alpine
ARG NGINX_IMAGE=nginx:1.28-alpine

FROM ${NODE_IMAGE} AS build
WORKDIR /app
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 CI=1
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm,sharing=locked npm ci --no-audit --no-fund --prefer-offline
COPY . .
# Empty = the API is reached on the same origin under /api (through this nginx).
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL
# Readable by the unprivileged nginx user whatever the checkout's umask was (files are copied with their modes).
RUN npm run build && chmod -R a+rX dist docker

FROM ${NGINX_IMAGE}
LABEL org.opencontainers.image.title="Signal School web app" \
      org.opencontainers.image.source="https://github.com/AGSAVALIYA/Signal-School-Frontend"
ARG UPGRADE_SYSTEM=true
# Security updates; nginx runs as the "nginx" user: pid file in /tmp, cache and rendered config owned by it.
RUN if [ "$UPGRADE_SYSTEM" = true ]; then apk upgrade --no-cache; fi \
 && sed -i -e 's|^user .*;||' -e 's|^pid .*;|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf \
 && rm -f /etc/nginx/conf.d/default.conf \
 && chown -R nginx:nginx /var/cache/nginx /etc/nginx/conf.d
# REAL_IP_*: whose header names the visitor's IP (see docker/nginx.conf.template); by default nobody's.
ENV API_UPSTREAM=http://api:3000 REAL_IP_FROM=127.0.0.1 REAL_IP_HEADER=X-Forwarded-For
COPY --from=build /app/docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s CMD wget -qO /dev/null http://127.0.0.1:8080/healthz || exit 1
