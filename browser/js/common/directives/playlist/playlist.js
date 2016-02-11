app.directive('playlist', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/common/directives/playlist/playlist-template.html',
        scope: {
            playlist: '=',
            room: '=',
            user: '=',
            'toggle': '=',
        },
        controller: function($scope, PlayerFactory, PlaylistFactory) {
            $scope.startPlaylist = PlayerFactory.startPlaylist;
            $scope.currentlyPlaying = PlaylistFactory.getCurrentSong;
            $scope.loadVideoById = PlayerFactory.loadVideoById;
            $scope.vote = PlaylistFactory.vote;
            $scope.getVoteValue = (song) => {
                return song.total;
            }
            $scope.upvoteAmount = PlaylistFactory.getUpvoteAmount;
            $scope.downvoteAmount = PlaylistFactory.getDownvoteAmount;
            $scope.checkUserVote = PlaylistFactory.checkUserVote;
        }
    }
});
