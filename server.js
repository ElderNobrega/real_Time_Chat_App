const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

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

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});

