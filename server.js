const express = require('express');
//connect to DB
const  connectDB = require('./DB/connection');
const mongoose = require('mongoose');
const path = require('path');
const guest = require('./DB/UserSchema');
const msg = require('./DB/MessageSchema');
const app = express();
const userRoute = require('./routes/userRoute')
const messageRoute = require('./routes/messageRoute')
const{room, getRooms} = require('./utils/room')

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const {generateMessage} = require('./utils/message.js');
const {checkString} = require('./utils/checkString');
const {Users} = require('./utils/users');
let users = new Users();

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/message', messageRoute);
app.use('/log', userRoute);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

console.log('Server running...');

app.get('/', (req, res) => {
    res.render('index.html');
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
});

io.on('connection', (socket) => {
    
    socket.on('new-user', (params, callback) => {
        if(!checkString(params.name) || !checkString(params.room)) {
            return callback("Name and room are required")
        }
        connectDB.then(db => {
            let guests = new guest({
                id: new mongoose.Types.ObjectId(),
                userName: params.name,
                room: params.room,
                timeStamp: new Date().getTime(),
                eventLog: 'User connected'
            });
            guests.save();
        });
        console.log(`Socket connected: ${socket.id}`)
        callback();
    });

    socket.on('join', (params, callback) => {
        if(!checkString(params.name) || !checkString(params.room)) {
            return callback("Name and room are required")
        }
        socket.join(params.room); 

        room(params.room);

        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room, 'User Joined room');
        
        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));

        //io.to(rooms).emit('updateRoomList', rooms);
        socket.emit('updateRoomList', getRooms());
        socket.broadcast.emit('updateRoomList', getRooms());

        socket.emit('newMessage', generateMessage('Admin', `Welcome to ${params.room} chat room!`));

        socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new User has Joined'));

        callback();
    });

    socket.on('leaveRoom', params => {
        console.log(params.room)
        socket.to(params.room).emit("newMessage", generateMessage('Admin', `${params.name} has desconnected from ${params.room}!`));
        socket.emit('newMessage', generateMessage('Admin', `You disconnect from ${params.room} chat room!`));
        connectDB.then(db => {
            let guests = new guest({
                id: new mongoose.Types.ObjectId(),
                userName: params.name,
                room: params.room,
                timeStamp: new Date().getTime(),
                eventLog: 'User Switching room'
            });
            guests.save();
        }).then(() => {
            socket.leave(params.room);
        }).catch(err => console.log(err));
    });

    socket.on('createMessage', (data) => {
        let user = users.getUser(socket.id);
        if (user && checkString(data.message)) {
            connectDB.then(db => {
                let message = new msg({
                    sender: user.name,
                    room: user.room,
                    timeStamp: new Date().getTime(),
                    message: data.message
                });
                message.save();
            });
        io.to(user.room).emit('newMessage', generateMessage(user.name, data.message));
        }
    });

    socket.on('disconnect', () => {
        let disUser = users.getUser(socket.id);
        let user = users.removeUser(socket.id);

        if (user) {

            connectDB.then(db => {
                let guests = new guest({
                    id: new mongoose.Types.ObjectId(),
                    userName: disUser.name,
                    room: disUser.room,
                    timeStamp: new Date().getTime(),
                    eventLog: 'User disconnected'
                });
                guests.save();
            });
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room`));
        }
    });
});

