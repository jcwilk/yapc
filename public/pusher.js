function initializeChat(inputId, startId, hostname){
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
        function handleMessage(msg) {
            console.log('going to '+msg.sequence);
            msg.id = 'msg-'+msg.id_hash;
            if($('#'+msg.id)[0]){
                var out = formatMessage(msg);
                $('#'+msg.id).replaceWith(out)
            }else{
                displayBefore(msg);
            }
        }

        function consumeData(data){
            var mostRecent = {};
            //console.log(data);

            function consumeNext(data){
                if(data.length){
                    for(var i in data) consumeNext(data[i])
                } else {
                    data.sequence = parseInt(data.sequence);
                    var competition = mostRecent[data.id_hash];
                    if(competition === undefined || competition.sequence < data.sequence) mostRecent[data.id_hash] = data;
                }
            }

            consumeNext(data);
            console.log('consumed down to: '+JSON.stringify(mostRecent));
            for(var i in mostRecent) handleMessage(mostRecent[i])
        }

        return consumeData
    }

    function messageCreateHandler(){
        function handleMessage(msg){
            displayAfter(msg)
        }

        function notify(){
            $.titleAlert("New Message!", {
                requireBlur:false,
                stopOnFocus:true,
                stopOnMouseMove:true,
                duration:10000,
                interval:1000
            })
        }

        function consumeData(data){
            if(data.length){
                for(var i in data) consumeData(data[i])
            } else {
                handleMessage(data)
            }
            notify()
        }

        return consumeData
    }

    //var pusher = new Pusher(appId);
    //var myChannel = pusher.subscribe('messages');
    NodePush.setHost(hostname);
    NodePush.bind('message-update', messageUpdateHandler());
    NodePush.bind('message-create', messageCreateHandler());
    monitorChatField(inputId);
    console.log('listening...')
}