describe("Yapc",function(){
    describe("(static) consumeAll",function(){
        var callCount = 0;
        function callIt(data,processCallback){
            Yapc.consumeAll(data,function(el){
                callCount++;
                processCallback(el)
            })
        }

        beforeEach(function(){
            callCount = 0;
        });

        it("invokes the callback once when a single json object",function(){
            var textVal;
            callIt({text: 'blah'},function(el){
                textVal = el.text
            });
            expect(textVal).toEqual('blah');
            expect(callCount).toEqual(1)
        });

        it("does nothing for an empty array",function(){
            var shouldBeUndefined;
            callIt([],function(el){
                shouldBeUndefined = 'defined';
            });
            expect(shouldBeUndefined).toEqual(undefined);
            expect(callCount).toEqual(0)
        });

        it("invokes the callback for each item",function(){
            var outArray = [];
            callIt(['first','second'],function(el){
                outArray.push(el)
            });
            expect(outArray).toEqual(['first','second']);
            expect(callCount).toEqual(2)
        })
    });

    describe("viewFactory",function(){
        var view,
            env,
            field;

        beforeEach(function(){
            loadFixtures('basicChat.html');
            env = {inputId: 'input-field',
                   startId: 'start-tag'};
            view = Yapc.viewFactory(env);
            field = $('#input-field')
        });

        describe("getInput",function(){
            it("returns the val of the text field",function(){
                field.val('field-value');
                expect(view.getInput()).toEqual('field-value')
            })
        });

        describe("clearInput",function(){
            it("clears the input field",function(){
                field.val('non-empty');
                view.clearInput();
                expect(field.val()).toEqual('')
            })
        })
    });

    describe("senderFactory",function(){
        var sender,
            env,
            inputValue;

        beforeEach(function(){
            inputValue = 'input-value';
            env = {view: {getInput: function(){ return inputValue }}};
            sender = Yapc.senderFactory(env,'POST',false)
        });

        describe("queueData",function(){
            it("appends data to to the queue",function(){
                inputValue = 'first';
                spyOn($,'ajax');
                sender();
                expect(sender._debug.queue.dump()[0].text).toEqual('first')
            });

            it("marks the queue for delivery",function(){
                spyOn($,'ajax');
                sender();
                expect($.ajax).toHaveBeenCalled()
            })
        });

        describe("markForDelivery",function(){
            it("sends an ajax request and then removes it from the queue",function(){
                sender._debug.queue.push({text: 'val'});
                var triggerSuccess;
                spyOn($,'ajax').andCallFake(function(options){
                    triggerSuccess = function(){options.complete(null,'success')}
                });
                sender._debug.markForDelivery();
                expect(sender._debug.queue.dump().length).toEqual(1);
                triggerSuccess();
                expect(sender._debug.queue.dump().length).toEqual(0);
            });

            it("won't send a second ajax until after the first",function(){
                sender._debug.queue.push({text: 'val'});
                var triggerSuccess;
                spyOn($,'ajax').andCallFake(function(options){
                    triggerSuccess = function(){options.complete(null,'success')}
                });
                sender._debug.markForDelivery();
                expect($.ajax.callCount).toEqual(1);
                sender._debug.markForDelivery();
                expect($.ajax.callCount).toEqual(1);
                sender._debug.queue.push({text: 'val2'});
                expect(sender._debug.queue.dump().length).toEqual(2);
                triggerSuccess();
                expect(sender._debug.queue.dump().length).toEqual(1);
                expect($.ajax.callCount).toEqual(2);
                triggerSuccess();
                expect(sender._debug.queue.dump().length).toEqual(0);
                expect($.ajax.callCount).toEqual(2); //make sure there isn't a third
            })

            it("won't send an ajax if the queue is empty",function(){
                spyOn($,'ajax');
                sender._debug.markForDelivery();
                expect($.ajax.callCount).toEqual(0)
            })
        })
    })
});