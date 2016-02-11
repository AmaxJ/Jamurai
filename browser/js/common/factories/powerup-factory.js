app.factory('PowerupFactory', (PlaylistFactory, $rootScope, SocketFactory, $http, AuthService) => {
    var factory = {};
    var socket = SocketFactory.getSocket();
    var activePowerups;
    var loggedInUser;
    AuthService.getLoggedInUser()
    .then(user=> {
        loggedInUser = user;
    })
    
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

    let powerUpIcons = {
            'Chopsticks of Plenty': '/food.svg',
            'Sword of Ultimate Shame': '/twoswords.svg',
            'Daggers of Disdain': '/daggerSolid.svg',
            'Katana of Disgrace': '/sword.svg',
            'Enlightened Blessing': '/discipline.svg',
            'Sword of Uncertainty': '/yinyang.svg',
            'Poison Darts': '/darts.svg',
            'The Last Jamurai': '/helmet.svg'
        }

    let formatPowerUps = powerUpObj => {
        if(!powerUpObj.powerups) return null;
        return powerUpObj.powerups.map(powerup => {
            let pwrUp = {};
            pwrUp.name = powerup;
            pwrUp.icon = powerUpIcons[powerup];
            return pwrUp;
        });
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


    factory.getPowerups = (userId, roomId) => {
        return $http({
            method: 'GET',
            url: `/api/powerups/${userId}/${roomId}`
        })
        .then(response => {
            if(response.data) {
                activePowerups = formatPowerUps(response.data);
            }   
            return response.data;
        });
    }

    factory.getActivePowerups = () => {
        return activePowerups;
    }


    factory.addPowerup = (playlistId, userId) => {
        socket.emit('addPowerUp', {user: userId, playlist: playlistId});
    }

    factory.usePowerup = (powerup,user,room) => {
        powerUps[powerup](user,room);
        return $http({
            method: 'POST',
            url: `/api/powerups/use-powerup/${user._id}/${room._id}`,
            data: {powerup: powerup}
        })
        .then(response => {
            activePowerups = formatPowerUps(response.data);
        })
    }

    socket.on('updatePowerups', function(updatedPowerups) {        
        if(updatedPowerups.user === loggedInUser._id) {
            activePowerups = formatPowerUps(updatedPowerups);
            $rootScope.$digest();     
        }   
    })

    return factory;

});
