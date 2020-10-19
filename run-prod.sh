#!/bin/bash

# CREATE BUNDLE
cd ./client
rm -rf node_modules package-lock.json
npm i
npm run build
cd ..

# COPY DIST FILES
cp -r ./client/dist/* ../www/

# RUN PEER SERVER
cd ./peer-server
./run.sh

