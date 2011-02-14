function initializeChat(inputId, startId){
    function createSender(method){
        var syncInProgress = false;
        var pendingText = false;
        var recur = function(text){
            if(!syncInProgress){
                pendingText = false;
                syncInProgress = true;
                $.ajax({
                    type: method,
                    url: '/m',
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
        return recur
    }

    var sendMessage = createSender('POST');
    var syncActiveText = createSender('PUT');

    function formatMessage(data){
        var out = "<p";
        if(data.id){
            out+=" id='"+data.id+"'";
        }
        if(data.color){
            out+=" style='color:#"+data.color+"'";
        }
        out+=">"+data.text+"</p>";
        return out
    }

    function displayAfter(data){
        $(formatMessage(data)).insertAfter('#'+startId)
    }

    function displayBefore(data){
        $(formatMessage(data)).insertBefore('#'+startId)
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
                    lastVal = field.val();
                }
            }
        })
    }
    monitorChatField(inputId);

    var pusher = new Pusher('d5593d81364f0abee5b0');
    var myChannel = pusher.subscribe('messages');

    myChannel.bind('message-update', function(msg) {
      msg.color = msg.ip_digest;
      msg.id = 'msg-'+msg.ip_digest;
      if($('#'+msg.id)[0]){
        var out = formatMessage(msg);
        $('#'+activeId).replaceWith(out)
      }else{
        displayBefore(msg);
      }
    });

    myChannel.bind('message-create', function(msg){
        msg.color = msg.ip_digest;
        displayAfter(msg);
    })
}

initializeChat('text-field','messages-start');