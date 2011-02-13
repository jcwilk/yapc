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

var syncInProgress = false
var resyncNeeded = false

var sync = function(){
  if(!syncInProgress){
    resyncNeeded = false;
    syncInProgress = true;
    $.ajax({
      type: 'POST',
      url: '/m',
      data: $('#text-field').serialize(),
      success: function(){syncInProgress=false; if(resyncNeeded){sync()}}
    });
  } else {
    resyncNeeded = true;
  }
};

function ChatFieldHandler(_fieldId){

    this.fieldId = _fieldId;
    this.field = $('#'+this.fieldId);
    this.val = this.field.val;

    this.handleKeyup = function(e){
        if(e.keyCode == '13'){
            val = this.val();
            this.val('');
        }else{
            sync();
        }
    };

    this.field.keyup(this.handleKeyup)
}

var chat = new ChatFieldHandler('text-field');

//$('#text-field').keyup(function(e) {
//  alert(e.keyCode);
  //$(e.keyCode).insertAfter('#messages-start');
//});