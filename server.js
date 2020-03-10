const express = require('express');
//connect to DB
const  connectDB = require('./DB/connection');
const path = require('path');

const app = express();
//connect to DB
connectDB();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const {generateMessage} = require('./utils/message.js');
const {checkString} = require('./utils/checkString');
const {Users} = require('./utils/users');
let users = new Users();

// 8 Express Api - testing code - Alan
// app.get('/api/history', function (req, res) {
//     res.send('Chat History -  Returns a JSON list of chat here')
//   })
// app.post('/api/eventlog', function (req, res) {
//     res.send('Chat History by Room Name - Return a JSON list of chat history for specific room name here')
// })


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

console.log('Server running...');

app.use('/', (req, res) => {
    res.render('index.html');
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
});

let messages = [];

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    socket.emit('previousMessages', messages)    

    socket.on('join', (params, callback) => {
        if(!checkString(params.name) || !checkString(params.room)) {
            return callback("Name and room are required")
        }
        socket.join(params.room);

        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room);
        
        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', `Welcome to ${params.room} chat room!`));

        socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new User has Joined'));

        callback();
    });

    socket.on('createMessage', (data) => {
        //messages.push(data);
        let user = users.getUser(socket.id);
        if (user && checkString(data.message)) {
        io.to(user.room).emit('newMessage', generateMessage(user.name, data.message));
        }
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room`));
        }
    });
});

