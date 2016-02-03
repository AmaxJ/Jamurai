app.directive('playlist', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/common/directives/playlist/playlist-template.html',
        scope: {
            songs: '=',
            room: '=',
            user: '='
        },
        controller: function($scope, PlayerFactory, PlaylistFactory) {
            $scope.loadVideoById = PlayerFactory.loadVideoById;
            $scope.vote = PlaylistFactory.vote;
            $scope.getVoteValue = (songObj) => {
                console.log('GETTING VOTE', songObj)
                return songObj.total;
            }
        }
    }
})
