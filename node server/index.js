//node server which will handle socket io connections
const io = require('socket.io')(process.env.PORT || 8000);
const users = {}; //socketId---Names
const userName = []; // All names
let rooms = {}; // socketId----roomVal
let peers = {}; // peerId------roomVal
let socPeer = {}; //socketId----peerId
let peerNames = {}; //peerId----names
io.on('connection', socket => {
    socket.on("new-user-joined", (name, roomVal, peerId) => {
        console.log("new-user-joined", name);
        console.log("new-peer-joined", peerId);

        peers[peerId] = roomVal;
        socPeer[socket.id] = peerId;
        peerNames[peerId] = name;



        let peersInPartRoom = [];
        for (let key in peers) {
            if (peers.hasOwnProperty(key)) {
                if (roomVal == peers[key]) {
                    peersInPartRoom.push(key);
                }
                // console.log(key, value);
            }
        }

        let peerNamesInPartRoom = {};
        peersInPartRoom.forEach(id => {
            peerNamesInPartRoom[id] = peerNames[id];
        })


        socket.join(roomVal);
        users[socket.id] = name;
        rooms[socket.id] = roomVal;
        userName.push(name);

        let userInPartRoom = [];
        for (let key in rooms) {
            if (rooms.hasOwnProperty(key)) {
                if (roomVal == rooms[key]) {
                    userInPartRoom.push(users[key]);
                }
                // console.log(key, value);
            }
        }

        io.sockets.to(roomVal).emit('update-users', userInPartRoom, peersInPartRoom, peerNamesInPartRoom);
        socket.broadcast.to(roomVal).emit('user-joined', name, userInPartRoom, socket.id, peerId);
    });

    socket.on('send', (message, roomVal) => {
        socket.broadcast.to(roomVal).emit('recieve', { message: message, name: users[socket.id] })
    });

    socket.on('disconnect', (message) => {


        const roomVal = rooms[socket.id];
        delete rooms[socket.id];
        delete peers[socPeer[socket.id]];
        delete peerNames[socPeer[socket.id]];


        let peersInPartRoom = [];
        for (let key in peers) {
            if (peers.hasOwnProperty(key)) {
                if (roomVal == peers[key]) {
                    peersInPartRoom.push(key);
                }
                // console.log(key, value);
            }
        }


        let peerNamesInPartRoom = {};
        peersInPartRoom.forEach(id => {
            peerNamesInPartRoom[id] = peerNames[id];
        })


        let userInPartRoom = [];
        for (let key in rooms) {
            if (rooms.hasOwnProperty(key)) {
                if (roomVal == rooms[key]) {
                    userInPartRoom.push(users[key]);
                }
            }
        }

        const index = userName.indexOf(users[socket.id]);
        if (index > -1) {
            userName.splice(index, 1);
        }
        socket.broadcast.to(roomVal).emit('left', users[socket.id], userInPartRoom, peersInPartRoom, socPeer[socket.id], peerNamesInPartRoom);
        delete users[socket.id];
        delete socPeer[socket.id];
    })
    socket.on('type', (name, roomVal) => {
        socket.broadcast.to(roomVal).emit('typing', users[socket.id]);
    });

    socket.on('stopsStreaming', (name, roomVal, peerId) => {
        socket.broadcast.to(roomVal).emit('printStopsStreaming', users[socket.id], peerId);

    })


});