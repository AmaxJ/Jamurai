app.directive('playlist', () => {
    return {
        restrict: 'E',
        templateUrl: '/js/common/directives/playlist/playlist-template.html',
        scope: {
            playlist: '=',
            room: '=',
            user: '=',
            'toggle': '=',
        },
        controller($scope, PlayerFactory, PlaylistFactory) {
            let checkCreator = () => {
                return $scope.user._id === $scope.room.creator._id;
            };
            $scope.userIsCreator = checkCreator();
            $scope.startPlaylist = PlayerFactory.startPlaylist;
            $scope.currentlyPlaying = PlaylistFactory.getCurrentSong;
            $scope.loadVideoById = PlayerFactory.loadVideoById;
            $scope.vote = PlaylistFactory.vote;
            $scope.getVoteValue = song => song.total;
            $scope.upvoteAmount = PlaylistFactory.getUpvoteAmount;
            $scope.downvoteAmount = PlaylistFactory.getDownvoteAmount;
            $scope.checkUserVote = PlaylistFactory.checkUserVote;
        }
    }
});
