app.factory('PowerupFactory', (PlaylistFactory, $rootScope) => {
    var factory = {};
    var powerUps = {'superVote': superVote}

    function superVote () {
        console.log('SUPER VOTE CALLED!')
        PlaylistFactory.setUpvoteAmount(10);
        $rootScope.$on('upvote', ()=> {
            PlaylistFactory.setUpvoteAmount(1);
        })
    }

    factory.usePowerup = (powerup) => {
        console.log('Power up to use', powerUps[powerup])
        powerUps[powerup]();
    }



    return factory;

});