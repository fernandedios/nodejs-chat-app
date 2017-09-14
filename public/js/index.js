var socket = io(); // initiate socket request

// register an event, when connected
socket.on('connect', function() {
  console.log('Connected to server');

  socket.emit('createMessage', {
    from: 'user',
    text: 'hello again'
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
  console.log('Got new message', message);
});
