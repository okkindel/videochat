#!/bin/bash

# CREATE BUNDLE
cd ./client
npm i & npm run build
cd ..

# COPY DIST FILES
cp -r ./client/dist/* ../www/

# RUN PEER SERVER
cd ./peer-server
./run.sh

