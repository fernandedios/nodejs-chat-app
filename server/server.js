const path = require('path'); // builtin node module
const http = require('http'); // builtin node module
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

// register an event, on connection
io.on('connection', (socket) => {
  console.log('New user connected');

  // event listener for disconnected user
  socket.on('disconnect', () => {
    console.log('User was disconnected.');
  });
});

server.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});
