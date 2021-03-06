FROM mhart/alpine-node:8.15.1

WORKDIR /shire
ADD . .

RUN apk add --no-cache make gcc g++ python && \
  npm install --production --silent && \
  apk del make gcc g++ python

EXPOSE 12201/udp
CMD ["node", "index.js"]