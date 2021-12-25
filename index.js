const express = require('express');
const app = express();
const server = require('http').Server(app);


var ExpressPeerServer = require('peer').ExpressPeerServer;

var options = {
    debug: true,
    allow_discovery: true
}

// peerjs is the path that the peerjs server will be connected to.
app.use('/peerjs', ExpressPeerServer(server, options));

app.use('/static', express.static('static'));
app.get('/room', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/leave.html');
})

server.listen(5500 || process.env.PORT, () => {
    console.log("App is listening at port 5500")
})