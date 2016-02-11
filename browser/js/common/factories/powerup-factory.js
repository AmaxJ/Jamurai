app.factory('PowerupFactory', (PlaylistFactory, $rootScope, SocketFactory, $http) => {
    var factory = {};
    var socket = SocketFactory.getSocket();
    var powerUps = {
        'Sword of Ultimate Shame': swordsOfCertainDeath,
        'Daggers of Disdain' : daggersOfDisdain,
        'Chopsticks of Plenty' : chopsticksOfPlenty,
        'Katana of Disgrace' : katanaOfDisgrace,
        'Enlightened Blessing' : soundOfEnlightenment,
        'Sword of Uncertainty' : swordOfUncertainty,
        'Poison Darts' : poisonDarts,
        'The Last Jamurai': theLastJamurai
    }

    function chopsticksOfPlenty () {
        PlaylistFactory.setUpvoteAmount(10);
        $rootScope.$on('upvote', ()=> {
            PlaylistFactory.setUpvoteAmount(1);
        })
    }

    function soundOfEnlightenment () {
        PlaylistFactory.setUpvoteAmount(100);
        $rootScope.$on('upvote', () => {
            PlaylistFactory.setUpvoteAmount(1);
        })
    }

    function swordsOfCertainDeath () {
        PlaylistFactory.setDownvoteAmount(-100);
        $rootScope.$on('downvote', ()=> {
            PlaylistFactory.setDownvoteAmount(-1);
        })
    }

    function katanaOfDisgrace () {
        PlaylistFactory.setDownvoteAmount(-10);
        $rootScope.$on('downvote', ()=> {
            PlaylistFactory.setDownvoteAmount(-1);
        })
    }

    function swordOfUncertainty () {
        var posOrNeg = [-10, 10];
        var zeroOrOne = Math.floor(Math.random()*2);
        var multiplier = posOrNeg[zeroOrOne];
        var randomNum = Math.floor(Math.random()*multiplier);
        PlaylistFactory.setUpvoteAmount(randomNum);
        $rootScope.$on('upvote', ()=> {
            PlaylistFactory.setUpvoteAmount(1);
        })
    }

    function daggersOfDisdain (user, room) {
        socket.emit('multiPower', {user: user, room: room, strength: -5});
    }

    function poisonDarts (user, room) {
        socket.emit('multiPower', {user: user, room: room, strength: -2});
    }

    function theLastJamurai (user, room) {
        socket.emit('multiPower', {user: user, room: room, strength: -1000});
    }

    factory.usePowerup = (powerup,user,room) => {
        powerUps[powerup](user,room);
        socket.emit('usePowerUp', {powerup: powerup, user: user,room: room});
        return $http({
            method: 'PUT',
            url: '/api/users/' + user._id + '/addpowerup',
            data: {powerup: powerup}
        }) 
    }

    return factory;

});
