const path = require('path'); // builtin node module
const http = require('http'); // builtin node module
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

// register an event, on connection
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    // console.log('params', params);
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room); // join room
    // socket.leave(params.roon);  // leave room

    // io.emit  -> io.to(params.room).emit // send to all in the room
    // socket.broadcast.emit -> socket.broadcast.to(params.room) // send to all except the originator

    users.removeUser(socket.id); // remove user from all other rooms
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    //emit to all connection
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    // send to all except the event originator
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    callback();
  });

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
    // console.log('User was disconnected.');
    let user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});
