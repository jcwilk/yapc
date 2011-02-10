var pusher = new Pusher('d5593d81364f0abee5b0');
var myChannel = pusher.subscribe('messages');
myChannel.bind('message-create', function(thing) {
  alert('A thing was created: ' + thing.text);
});