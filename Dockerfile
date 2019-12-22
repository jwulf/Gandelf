FROM mhart/alpine-node:12.10.0 AS ts-builder

WORKDIR /shire
ADD . .

RUN apk add --no-cache make gcc g++ python 
RUN npm install
RUN npm run clean
RUN npm run build
RUN apk del make gcc g++ python

FROM mhart/alpine-node:12.10.0 AS ts-prod

WORKDIR /shire
EXPOSE 12201/udp

COPY --from=ts-builder ./shire/dist ./dist
COPY package* ./
RUN npm install --production
CMD npm start
