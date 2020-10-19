const { ExpressPeerServer } = require('peer');
const express = require('express');
const fs = require('fs');

const app = express();
const server = app.listen(9000);

const peerServer = new ExpressPeerServer(server,{
  path: '/textless',
  ssl: {
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt')
  }
});

app.use('/', peerServer);
