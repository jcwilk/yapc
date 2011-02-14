function initializeChat(inputId, startId){
    function createSender(method){
        var syncInProgress = false;
        var pendingText = false;
        return function(text){
            if(!syncInProgress){
                pendingText = false;
                syncInProgress = true;
                var recur = this;
                $.ajax({
                    type: method,
                    url: '/d',
                    data: {text: text},
                    success: function(){
                        syncInProgress=false;
                        if(pendingText){
                            recur(pendingText)
                        }
                    }
                });
            } else {
                pendingText = text;
            }
        }
    }

    var sendMessage = createSender('POST');
    var syncActiveText = createSender('PUT');

    function display(output){
        $(output).insertAfter('#'+startId)
    }

    function monitorChatField(_fieldId){
        var field = $('#'+_fieldId);
        var lastVal = field.val();
        field.bind({
            keyup: function(e){
                if(e.keyCode == '13'){
                    sendMessage(field.val());
                    field.val('');
                }
                if(field.val() != lastVal){
                    syncActiveText(field.val());
                }
            }
        })
    }
    monitorChatField(inputId);

    var pusher = new Pusher('d5593d81364f0abee5b0');
    var myChannel = pusher.subscribe('messages');

    myChannel.bind('message-update', function(msg) {
      var activeId='msg-'+msg.ip_digest
      var out="<p id='"+activeId+"'>"+msg.ip_digest+': '+msg.text+"</p>";
      if($('#'+activeId)[0]){
        $('#'+activeId).replaceWith(out)
      }else{
        display(out);
      }
    });

    myChannel.bind('message-create', function(msg){
        var out="<p>"+msg.ip_digest+': '+msg.text+"</p>";
        display(out);
    })
}

initializeChat('text-field','messages-start');