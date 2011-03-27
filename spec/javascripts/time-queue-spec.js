describe("TimeQueue",function(){
    var queue;

    function newQueue(){ return TimeQueue.create() }

    beforeEach(function(){
        queue = newQueue();
    });

    describe("push",function(){
        it("appends the item to the end of the queue",function(){
            queue.push({text: 'first'});
            queue.push({text: 'second'});
            expect(queue.dump()[1].text).toEqual('second')
        });

        it("chains",function(){
            expect(function(){ queue.push({text: 'first'}).push({text: 'second'}) }).not.toThrow();
            expect(queue.dump()[1].text).toEqual('second');
        })
    });

    describe("dump",function(){
        it("returns all the queued objects in order",function(){
            queue.push({text: 'first'});
            queue.push({text: 'second'});
            expect(queue.dump()).toEqual([{text: 'first'},{text: 'second'}])
        });

        it("returns an empty array for an empty queue",function(){
            expect(queue.dump()).toEqual([]);
        });

        it("prevents crosstalk to previous dumps",function(){
            queue.push({text: 'before'});
            var old_dump = queue.dump();
            queue.push({text: 'after'});
            expect(old_dump.length).not.toEqual(queue.dump().length)
        })
    });

    describe("reset",function(){
        beforeEach(function(){
            queue.push({text: 'test'});
        });

        it("clears the queue",function(){
            queue.reset();
            expect(queue.dump()).toEqual([])
        });

        it("chains",function(){
            expect(function(){ queue.reset().push({text: 'new text!'}) }).not.toThrow();
            expect(queue.dump()[0]).toEqual({text: 'new text!'})
        });
    });

    describe("removeFromHead",function(){
        beforeEach(function(){
            queue.push({text: 'first'});
            queue.push({text: 'second'})
        });

        it("removes the elements you pass from the head of the queue",function(){
            var els = queue.dump();
            queue.removeFromHead(els);
            expect(queue.dump()).toEqual([])
        });

        it("throws if you pass it something that isn't at the head",function(){
            //pending
            
            //var els = queue.dump();
            //els.shift(); //pop out the first head element
            //expect(function(){
            //    queue.removeFromHead(els)
            //}).toThrow()
        });

        it("chains")
    })
});