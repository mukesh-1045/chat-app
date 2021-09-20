const { Socket } = require('dgram');
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words')
const { generateMsg, generateLocationMsg } = require('./utils/msg');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

// app.get('/', (req, res) => {

// })
// let count = 0;
// let msg = 'Welcome';

io.on('connection', (socket) => {
    console.log('new websocket connection');

    //learning
    // count = count + 1;
    // socket.emit('countUpdated', count)

    // socket.on('increment', () => {
    //     count++;
    //     // socket.emit('countUpdated', count)  just for emit for single connection
    //     io.emit('countUpdated', count)    // emit event for all connection 
    // })

    socket.on('join', (options, callback) => {

        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('welcomeMsg', generateMsg("System", 'Welcome'));

        socket.broadcast.to(user.room).emit('welcomeMsg', generateMsg("System", `${user.username} has joined the room !!!`));

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room),
        })

        callback()
        //io.to.emit == emit event to everone to a room
        //socekt.broadcast.to.emit == to all expect sender
    })

    socket.on('sendMsg', (msg, callback) => {

        const user = getUser(socket.id);

        const filter = new Filter();

        if (filter.isProfane(msg)) {
            return callback('Bad- words are not allowed');
        }

        io.to(user.room).emit('welcomeMsg', generateMsg(user.username, msg));
        callback('done')
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMsg', generateLocationMsg(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback('location shared');
    })

    socket.on('disconnect', () => {

        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('welcomeMsg', generateMsg("System", `${user.username} left the Chat Room`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room),
            })
        }

    })



})



server.listen(port, () => {
    console.log('running express server on ', port);
})