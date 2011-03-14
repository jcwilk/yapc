describe("Yapc",function(){
    describe("(protected) consumeAll",function(){
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
    })
});