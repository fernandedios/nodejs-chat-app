//*** from server
// register an event, on connection
io.on('connection', (socket) => {
  console.log('New user connected');

  // create event, send to client
  // emits to one connection
  socket.emit('newEmail', {
    from: 'mike@example.com',
    text: 'Hey, what is going on',
    created: 123
  });

  listen for custom event createEmail
  socket.on('createEmail', (newEmail) => {
    console.log('createEmail', newEmail);
  });

  // event listener for disconnected user
  socket.on('disconnect', () => {
    console.log('User was disconnected.');
  });
});



//*** from client
var socket = io(); // initiate socket request

// register an event, when connected
socket.on('connect', function() {
  console.log('Connected to server');

  socket.emit('createEmail', {
    to: 'jen@example.com',
    text: 'Hey. This is Fernan'
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

// custom event new email
socket.on('newEmail', function(email) {
  console.log('New Email', email);
});
