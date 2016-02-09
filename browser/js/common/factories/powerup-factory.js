app.factory('PowerupFactory', (PlaylistFactory, $rootScope, SocketFactory) => {
    var factory = {};
    var socket = SocketFactory.getSocket();
    var powerUps = {
        'swordOfCertainDeath': swordOfCertainDeath,
        'deathStars' : deathStars,
        'swordOfHonor' : swordOfHonor,
        'swordOfDisgrace' : swordOfDisgrace,
        'swordOfHolyLegend' : swordOfHolyLegend,
        'swordOfUncertainty' : swordOfUncertainty,
        'poisonDarts' : poisonDarts
    }

    function swordOfHonor () {
        PlaylistFactory.setUpvoteAmount(10);
        $rootScope.$on('upvote', ()=> {
            PlaylistFactory.setUpvoteAmount(1);
        })
    }

    function swordOfHolyLegend () {
        PlaylistFactory.setUpvoteAmount(100);
        $rootScope.$on('upvote', ()=> {
            PlaylistFactory.setUpvoteAmount(1);
        })
    }

    function swordOfCertainDeath () {
        PlaylistFactory.setDownvoteAmount(-100);
        $rootScope.$on('downvote', ()=> {
            PlaylistFactory.setDownvoteAmount(-1);
        })
    }

    function swordOfDisgrace () {
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

    function deathStars (user, room) {
        socket.emit('multiPower', {user: user, room: room, strength: -5});
    }

    function poisonDarts (user, room) {
        socket.emit('multiPower', {user: user, room: room, strength: -2});
    }

    factory.usePowerup = (powerup,user,room) => {
        powerUps[powerup](user,room);
        socket.emit('usePowerUp', {powerup: powerup, user: user,room: room});
    }

    return factory;

});
