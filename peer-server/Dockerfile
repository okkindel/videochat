FROM node:10

COPY private.key certificate.crt ./
RUN npx peer --port 5000 --key peerjs --path /textless --sslkey private.key --sslcert certificate.crt
