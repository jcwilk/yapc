function initializeChat(inputId, startId){
    function createSender(method, sequential){
        var sequence = 0;
        return function(text){
            var data = {text: text};
            if(sequential){
                data['sequence'] = sequence;
                sequence+= 1;
            }
            $.ajax({
                type: method,
                url: '/m',
                data: data
            });
        }
    }

    var sendMessage = createSender('POST',false);
    var syncActiveText = createSender('PUT',true);

    function formatMessage(data){
        var out = "<p";
        if(data.id){
            out+=" id='"+data.id+"'";
        }
        out+=" style='color: #"+data.ip_digest+"'";
        out+=">"+data.ip_digest+': '+data.text+"</p>";
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

    var clientSequenceHash = {};
    myChannel.bind('message-update', function(msg) {
        var lastSequence = clientSequenceHash[msg.ip_digest];
        var currentSequence = parseInt(msg.sequence);
        console.log(msg);
        console.log(lastSequence);
        if(!lastSequence || (lastSequence < currentSequence)) {
            clientSequenceHash[msg.ip_digest] = currentSequence;
            msg.id = 'msg-'+msg.ip_digest;
            if($('#'+msg.id)[0]){
                var out = formatMessage(msg);
                $('#'+msg.id).replaceWith(out)
            }else{
                displayBefore(msg);
            }
        }
    });

    myChannel.bind('message-create', function(msg){
        displayAfter(msg);
    })
}

initializeChat('text-field','messages-start');