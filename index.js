'user strict';

const express = require("express");
var app = express();
var server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

const routes = require('./routes');
routes(io);

server.listen(port, () => {
    console.log('server start');
});