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
        controller: function($scope, $rootScope, PlayerFactory, PlaylistFactory, RoomFactory, SocketFactory) {

            $scope.startPlaylist = PlayerFactory.startPlaylist;
            var socket = SocketFactory.getSocket();
            $scope.currentlyPlaying = PlaylistFactory.getCurrentSong;
            $scope.loadVideoById = PlayerFactory.loadVideoById;
            $scope.vote = PlaylistFactory.vote;
            $scope.getVoteValue = (song) => {
                return song.total;
            }
            $scope.upvoteAmount = PlaylistFactory.getUpvoteAmount;
            $scope.downvoteAmount = PlaylistFactory.getDownvoteAmount;
            $scope.checkUserVote = PlaylistFactory.checkUserVote;
            $scope.messages = [];
            for(var x=0; x<$scope.room.messages.length; x++)
            {
                var obj = {};
                obj.text = $scope.room.messages[x];
                $scope.messages.push(obj);
            }

            socket.on('updateRoom', updateObj => {
                var room = updateObj.room;
                RoomFactory.setRoomState(room);
                $scope.room = room;
                $scope.messages = [];
                for(var x=0; x<$scope.room.messages.length; x++)
                {
                    var obj = {};
                    obj.text = $scope.room.messages[x];
                    $scope.messages.push(obj);
                }
                $scope.$digest();
            })

            $scope.messageWorks = function() {
                var roomId = $scope.room._id;
                var userName = $scope.user.username;
                var message = $scope.chatEntry;
                $scope.chatEntry = '';
                RoomFactory.addMessage(roomId,userName,message)
            }
        }
    }
});
