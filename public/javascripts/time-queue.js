var TimeQueue = (function(){
    function queueFactory(){
        var queue = [];

        function push(newVal){
            queue.push(newVal);
            return this
        }

        function dump(){
            return queue.slice()
        }

        function reset(){
            queue.splice(0,queue.length);
            return this
        }

        return {push: push, //chains
                dump: dump,
                reset: reset}
    }

    return {create: queueFactory}
})();