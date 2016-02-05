app.factory('PowerupFactory', (PlaylistFactory, $rootScope) => {
    var factory = {};
    var powerUps = {
        'superVote': superVote,
        'downvoteBomb': downvoteBomb
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

    factory.usePowerup = (powerup) => {
        powerUps[powerup]();
    }

    return factory;

});