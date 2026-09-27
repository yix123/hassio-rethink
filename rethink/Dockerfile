FROM node:22-alpine

RUN apk add --no-cache openssl jq bash curl
WORKDIR /app
COPY source/ /app/
ENV SKIP_GIT_HOOKS=1
RUN npm ci && npm run build

COPY run.sh /run.sh
RUN chmod +x /run.sh
ENTRYPOINT ["/run.sh"]
