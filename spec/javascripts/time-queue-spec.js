//describe("Player", function() {
//  var player;
//  var song;
//
//  beforeEach(function() {
//    player = new Player();
//    song = new Song();
//  });
//
//  it("should be able to play a Song", function() {
//    player.play(song);
//    expect(player.currentlyPlayingSong).toEqual(song);
//
//    //demonstrates use of custom matcher
//    expect(player).toBePlaying(song);
//  });
//
//  describe("when song has been paused", function() {
//    beforeEach(function() {
//      player.play(song);
//      player.pause();
//    });
//
//    it("should indicate that the song is currently paused", function() {
//      expect(player.isPlaying).toBeFalsy();
//
//      // demonstrates use of 'not' with a custom matcher
//      expect(player).not.toBePlaying(song);
//    });
//
//    it("should be possible to resume", function() {
//      player.resume();
//      expect(player.isPlaying).toBeTruthy();
//      expect(player.currentlyPlayingSong).toEqual(song);
//    });
//  });
//
//  // demonstrates use of spies to intercept and test method calls
//  it("tells the current song if the user has made it a favorite", function() {
//    spyOn(song, 'persistFavoriteStatus');
//
//    player.play(song);
//    player.makeFavorite();
//
//    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
//  });
//
//  //demonstrates use of expected exceptions
//  describe("#resume", function() {
//    it("should throw an exception if song is already playing", function() {
//      player.play(song);
//
//      expect(function() {
//        player.resume();
//      }).toThrow("song is already playing");
//    });
//  });
//});

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
    })
});