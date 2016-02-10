app.directive('playlist', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/common/directives/playlist/playlist-template.html',
        scope: {
            playlist: '=',
            room: '=',
            user: '='
        },
        controller: function($scope, PlayerFactory, PlaylistFactory) {
            $scope.loadVideoById = PlayerFactory.loadVideoById;
            $scope.vote = PlaylistFactory.vote;
            $scope.getVoteValue = (song) => {
                return song.total;
            }
            $scope.upvoteAmount = PlaylistFactory.getUpvoteAmount;
            $scope.downvoteAmount = PlaylistFactory.getDownvoteAmount;
            $scope.checkIfUserVoted = PlaylistFactory.checkIfUserVoted;
        }
    }
});
