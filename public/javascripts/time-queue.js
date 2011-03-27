var TimeQueue = (function(){
    function queueFactory(){
        var self = {},
            queue = [];

        self.push = function(newVal){
            queue.push(newVal);
            return this
        };

        self.dump = function(){
            return queue.slice()
        };

        self.reset = function(){
            queue.splice(0,queue.length);
            return this
        };

        self.removeFromHead = function(els){
            queue.splice(0,els.length)
        };

        return self
    }

    return {create: queueFactory}
})();