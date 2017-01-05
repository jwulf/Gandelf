FROM mhart/alpine-node

WORKDIR /shire
ADD . .

RUN npm i 

EXPOSE 12201/udp
CMD ["node", "index.js"]