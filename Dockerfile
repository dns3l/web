FROM node:16-alpine

LABEL org.opencontainers.image.title="dns3l web"
LABEL org.opencontainers.image.description="A SPA web client for DNS3L"
LABEL org.opencontainers.image.version=1.0.0

ENV VERSION=1.0.0

ENV PAGER=less

ARG http_proxy
ARG https_proxy
ARG no_proxy

# provided via BuildKit
ARG TARGETPLATFORM
ARG TARGETOS
ARG TARGETARCH
ARG TARGETVARIANT

# defaults for none BuildKit
ENV _platform=${TARGETPLATFORM:-linux/amd64}
ENV _os=${TARGETOS:-linux}
ENV _arch=${TARGETARCH:-amd64}
ENV _variant=${TARGETVARIANT:-}

ENV DNS3LPATH="/home/dns3l"
ENV DNS3L="/home/dns3l"

ARG DNS3LUID=1042
ARG DNS3LGID=1042

RUN apk --update upgrade && \
    apk add --no-cache \
        ca-certificates curl less bash busybox-extras \
        joe tzdata coreutils openssl && \
    addgroup -g ${DNS3LGID} dns3l && \
    adduser -D -u ${DNS3LUID} -G dns3l dns3l && \
    chmod g-s ${DNS3LPATH} && \
    chown dns3l:dns3l ${DNS3LPATH} && \
    rm -rf /var/cache/apk/*

# Install dockerize
#
ENV DCKRZ_VERSION="0.17.0"
RUN _arch=${_arch/amd64/x86_64} && curl -fsSL https://github.com/powerman/dockerize/releases/download/v$DCKRZ_VERSION/dockerize-${_os}-${_arch}${_variant} > /dckrz && \
    chmod a+x /dckrz

# Set environment variables
ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000
ENV NODE_ENV production

USER dns3l
WORKDIR $DNS3LPATH

COPY --chown=dns3l:dns3l package*.json ${DNS3LPATH}/
RUN yarn install
COPY --chown=dns3l:dns3l . ${DNS3LPATH}/
COPY docker-entrypoint.sh /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD [ "yarn", "start" ]
