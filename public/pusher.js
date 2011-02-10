var pusher = new Pusher('d5593d81364f0abee5b0');
var myChannel = pusher.subscribe('messages');

myChannel.bind('message-create', function(thing) {
  id='msg-'+thing.ip_digest
  msg="<p id='"+id+"'>"+thing.ip_digest+': '+thing.text+"</p>";
  if($('#'+id)[0]){
    $('#'+id).replaceWith(msg)
  }else{
    $(msg).insertAfter('#messages-start');
  }
});

$('#text-field').keyup(function(e) {
  $.post('/m',$('#text-field').serialize());
});