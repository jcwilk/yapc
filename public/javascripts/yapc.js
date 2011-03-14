var Yapc = (function(){
    var self = {instances: []};

    self.consumeAll = function(data,processCallback){
        if((typeof data) != 'object' || data.length === undefined){ //Presumably a Hash Object, process it.
            processCallback(data)
        } else { //Presumably an array, recur over each element.
            for(var i in data) self.consumeAll(data[i],processCallback)
        }
    };

    return self
})();

Yapc.messageUpdateHandlerFactory = function(env){
    function handleMessage(msg) {
        msg.id = 'msg-'+msg.id_hash;
        if($('#'+msg.id)[0]){
            var cssTarget = '#'+msg.id;
            env.output.displayInsteadOf(msg,cssTarget)
        } else {
            env.output.displayBefore(msg)
        }
    }

    function consumeData(data){
        var mostRecentById = {};

        Yapc.consumeAll(data,function(el){
            el.sequence = parseInt(el.sequence);
            var competition = mostRecentById[el.id_hash];
            if(competition === undefined || competition.sequence < el.sequence) mostRecentById[el.id_hash] = el
        });

        //TODO: only redraw ones that changed
        for(var id in mostRecentById) handleMessage(mostRecentById[id])
    }

    return consumeData
};

Yapc.messageCreateHandlerFactory = function(env){
    function handleMessage(msg){
        env.output.displayAfter(msg)
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
        Yapc.consumeAll(data,handleMessage);
        notify()
    }

    return consumeData
};

Yapc.outputterFactory = function(env){
    var self = {};

    function formatMessage(data){
        var out = "<p";
        if(data.id){
            out+=" id='"+data.id+"'";
        }
        out+=" style='color: #"+data.id_hash+"'";
        out+=">"+data.name+': '+data.text+"</p>";
        return out
    }

    self.displayAfter = function(data){
        $(formatMessage(data)).insertAfter('#'+env.startId)
    };

    self.displayBefore = function(data){
        $(formatMessage(data)).insertBefore('#'+env.startId)
    };

    self.displayInsteadOf = function(msg,cssTarget){
        $(cssTarget).replaceWith(formatMessage(msg))
    };

    self.field = $('#'+env.inputId)

    return self
};

Yapc.senderFactory = function(env, method, sequential){
    function sendData(data){
        $.ajax({
            type: method,
            url: '/m',
            data: data
        })
    }

    function fieldData(){ return {text: env.output.field.val()} }

    if(sequential){
        var sequence = 0,
            lastData;
        return function(){
            var data = fieldData();
            if(data != lastData){
                data.sequence = sequence;
                sequence++;
                sendData(data)
            }
        }
    } else {
        return function(){ sendData(fieldData()) }
    }

};

Yapc.initializeChat = function(inputId, startId, hostname){
    var env = {
        inputId: inputId,
        startId: startId,
        hostname: hostname
    };

    env.sendMessage = Yapc.senderFactory(env,'POST',false);
    env.syncActiveText = Yapc.senderFactory(env,'PUT',true);
    env.output = Yapc.outputterFactory(env);
    env.messageUpdateHandler = Yapc.messageUpdateHandlerFactory(env);
    env.messageCreateHandler = Yapc.messageCreateHandlerFactory(env);

    env.output.field.bind({
        keyup: function(e){
            if(e.keyCode == '13'){
                env.sendMessage();
                env.output.field.val('')
            }
            env.syncActiveText()
        }
    });

    //TODO: Make these non-singleton-friendly
    NodePush.setHost(hostname);
    NodePush.bind('message-update', env.messageUpdateHandler);
    NodePush.bind('message-create', env.messageCreateHandler);

    Yapc.instances.push(env) //for debugging/testing purposes
}