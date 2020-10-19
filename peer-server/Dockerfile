FROM node:10

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install

COPY . ./
CMD ["npm", "start"]

# CMD ["npx", "peer", "--port", "5000", "--key", "peerjs", "--path", "/textless", "--sslkey", "private.key", "--sslcert", "certificate.crt", "&"]
