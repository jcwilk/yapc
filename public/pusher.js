function initializeChat(inputId, startId, appId){
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
        out+=" style='color: #"+data.id_hash+"'";
        out+=">"+data.name+': '+data.text+"</p>";
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

    function messageUpdateHandler(){
        var clientSequenceHash = {};
        return function(msg) {
            var lastSequence = clientSequenceHash[msg.id_hash];
            var currentSequence = parseInt(msg.sequence);
            if(!lastSequence || (lastSequence < currentSequence)) {
                clientSequenceHash[msg.id_hash] = currentSequence;
                msg.id = 'msg-'+msg.id_hash;
                if($('#'+msg.id)[0]){
                    var out = formatMessage(msg);
                    $('#'+msg.id).replaceWith(out)
                }else{
                    displayBefore(msg);
                }
            }
        }
    }

    function messageCreateHandler(){
        return function(msg) {
            displayAfter(msg);
            $.titleAlert("New Message!", {
                requireBlur:false,
                stopOnFocus:true,
                stopOnMouseMove:true,
                duration:10000,
                interval:1000
            });
        }
    }

    var pusher = new Pusher(appId);
    var myChannel = pusher.subscribe('messages');
    myChannel.bind('message-update', messageUpdateHandler());
    myChannel.bind('message-create', messageCreateHandler());
    monitorChatField(inputId);
}