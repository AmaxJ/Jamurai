app.factory('PowerupFactory', (PlaylistFactory, $rootScope, SocketFactory) => {
    var factory = {};
    var socket = SocketFactory.getSocket();
    var powerUps = {
        'superVote': superVote,
        'downvoteBomb': downvoteBomb,
        'deathStars' : deathStars
    }

    function superVote () {
        PlaylistFactory.setUpvoteAmount(10);
        $rootScope.$on('upvote', ()=> {
            PlaylistFactory.setUpvoteAmount(1);
        })
    }

    function downvoteBomb () {
        PlaylistFactory.setDownvoteAmount(-100);
        $rootScope.$on('downvote', ()=> {
            PlaylistFactory.setDownvoteAmount(-1);
        })
    }

    function deathStars (user, room) {
        socket.emit('deathStars', {user: user, room: room});
    }

    factory.usePowerup = (powerup,user,room) => {
        powerUps[powerup](user,room);
        socket.emit('usePowerUp', {powerup: powerup, user: user,room: room});
    }

    return factory;

});