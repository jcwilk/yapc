var pusher = new Pusher('d5593d81364f0abee5b0');
var myChannel = pusher.subscribe('messages');

myChannel.bind('message-create', function(thing) {
  if($('#msg-'+thing.ip_digest)[0]){
    $('#msg-'+thing.ip_digest).text(thing.text)
  }else{
    $("<p id='"+'msg-'+thing.ip_digest+"'>"+thing.text+"</p>").insertAfter('#messages-start');
  }
});

$('#text-field').keyup(function(e) {
  $.post('/m',$('#text-field').serialize());
});