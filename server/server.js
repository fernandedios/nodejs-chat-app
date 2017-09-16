const path = require('path'); // builtin node module
const http = require('http'); // builtin node module
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

// register an event, on connection
io.on('connection', (socket) => {
  console.log('New user connected');

  //emit to all connection
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  // send to all except the event originator
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);

    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  // event listener for disconnected user
  socket.on('disconnect', () => {
    console.log('User was disconnected.');
  });
});

server.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});
