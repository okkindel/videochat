const { ExpressPeerServer } = require('peer');
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();

const credentials = {
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt')
};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);


const peerServer = new ExpressPeerServer(httpServer,{
  path: '/textless',
  ssl: {
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt')
  }
});

const peerHttpsServer = new ExpressPeerServer(httpsServer,{
  path: '/textless',
  ssl: {
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt')
  }
});

httpServer.listen(9080);
httpsServer.listen(9443);
