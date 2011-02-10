var pusher = new Pusher('d5593d81364f0abee5b0');
var myChannel = pusher.subscribe('messages');

myChannel.bind('message-create', function(thing) {
  $("<p>"+thing.text+"</p>").insertAfter('.message-start');
});

$('#text-field').keydown(function(e) {
  if(e.keyCode == '13'){
    $.post('/m',$('#text-field').serialize());
  }
});