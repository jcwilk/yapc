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
            env.view.displayInsteadOf(msg,cssTarget)
        } else {
            env.view.displayBefore(msg)
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
        env.view.displayAfter(msg)
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

Yapc.viewFactory = function(env){
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

    self.field = $('#'+env.inputId);

    self.getInput = function(){
        return self.field.val()
    };

    self.clearInput = function(){
        self.field.val('')
    };

    self.displayAfter = function(data){
        $(formatMessage(data)).insertAfter('#'+env.startId)
    };

    self.displayBefore = function(data){
        $(formatMessage(data)).insertBefore('#'+env.startId)
    };

    self.displayInsteadOf = function(msg,cssTarget){
        $(cssTarget).replaceWith(formatMessage(msg))
    };

    return self
};

Yapc.senderFactory = function(env, method, sequential){
    var queue = TimeQueue.create();
    var deliveryWaiting = false;
    var deliveryInProgress = false;

    function markForDelivery(){
        var data = queue.dump();
        if(!data.length){return}

        if(deliveryInProgress){
            deliveryWaiting = true
        } else {
            deliveryWaiting = false;
            deliveryInProgress = true;
            $.ajax({
                type: method,
                url: '/m',
                data: {data: data}, //data!
                complete: function(xhr,status){
                    if(status == 'success'){
                        deliveryInProgress = false;
                        queue.removeFromHead(data);
                        if(deliveryWaiting) markForDelivery()
                    } else { //failure, try again in 5
                        setTimeout(function(){
                            deliveryInProgress = false;
                            markForDelivery()
                        },5000)
                    }
                }
            }) //end ajax
        }
    }

    function queueData(data){
        queue.push(data);
        markForDelivery()
    }

    function fieldData(){
        return {text: env.view.getInput()}
    }

    var sender;
    if(sequential){ //numbers data updates, skips when it doesn't change
        var sequence = 0,
            lastData;
        sender = function(){
            var data = fieldData();
            if(data != lastData){
                data.sequence = sequence;
                sequence++;
                queueData(data)
            }
        }
    } else { //never skips data, does not number the data
        sender = function(){ queueData(fieldData()) }
    }
    sender._debug = {queue: queue,
                     markForDelivery: markForDelivery,
                     queueData: queueData};
    return sender
};

Yapc.initializeChat = function(inputId, startId, pushAddress){
    var env = {
        inputId: inputId,
        startId: startId,
        pushAddress: pushAddress
    };

    //These send data to the server
    env.sendMessage = Yapc.senderFactory(env,'POST',false);
    env.syncActiveText = Yapc.senderFactory(env,'PUT',true);

    //This abstracts the dom interactions
    env.view = Yapc.viewFactory(env);

    //These handle incoming data from the push library
    env.messageUpdateHandler = Yapc.messageUpdateHandlerFactory(env);
    env.messageCreateHandler = Yapc.messageCreateHandlerFactory(env);

    //This links up the senders with key events
    //TODO: encapsulate most of this into the view object, not a huge priority
    env.view.field.bind({
        keyup: function(e){
            if(e.keyCode == '13'){
                env.sendMessage();
                env.view.clearInput()
            }
            env.syncActiveText()
        }
    });

    //TODO: Make these support Yapc not being singleton
    NodePush.setHost(env.pushAddress);
    NodePush.bind('message-update', env.messageUpdateHandler);
    NodePush.bind('message-create', env.messageCreateHandler);

    Yapc.instances.push(env) //for debugging/testing purposes
}