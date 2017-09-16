var socket = io(); // initiate socket request

// register an event, when connected
socket.on('connect', function() {
  console.log('Connected to server');
});

// event listener when disconnected from the server
socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
  console.log('newMessage', message);

  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');
  a.attr('href', message.url);
  li.text(`${message.from}: `);
  li.append(a);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()

  }, function() { // pass callback method
    messageTextbox.val(''); // clear value
  });
});


var locationButton = jQuery('#send-location');
locationButton.on('click', function(e) {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  // get user location
  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location');
  })
});
