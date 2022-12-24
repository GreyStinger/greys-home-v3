rm -rf ./public/temp/*
yarn build
export NODE_ENV=production
node server.js
