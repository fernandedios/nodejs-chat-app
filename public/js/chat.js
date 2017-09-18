var socket = io(); // initiate socket request

function scrollToBottom() {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child'); // last listitem

  // Heights
  var clientHeight = messages.prop('clientHeight'); // user visible area
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight(); // second to the last listitem

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    // console.log('Should scroll');
    messages.scrollTop(scrollHeight);
  }
}

// register an event, when connected
socket.on('connect', function() {
  console.log('Connected to server');
});

// event listener when disconnected from the server
socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
  // console.log('newMessage', message);
  var formattedTime = moment(message.createdAt).format('h:mm a');

  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
  // console.log('newLocationMessage', message);
  var formattedTime = moment(message.createdAt).format('h:mm a');

  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
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

  // get user location, sends a prompt for permission
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
