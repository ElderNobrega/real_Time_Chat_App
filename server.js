const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const {generateMessage} = require('./utils/message.js');
const {checkString} = require('./utils/checkString');

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
            callback("Name and room are required")
        }
        socket.join(params.room);

        socket.emit('newMessage', generateMessage('Admin', `Welcome to ${params.room} chat room!`));

        socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new User Joined'));

        callback();
    });

    socket.on('createMessage', data => {
        messages.push(data);
        io.emit('newMessage', generateMessage(data.author, data.message));
    });
});

