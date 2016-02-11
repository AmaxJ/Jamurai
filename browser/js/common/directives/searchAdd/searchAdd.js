app.directive('searchAdd', function (SubmitSongFactory, PlaylistFactory, SocketFactory, RoomFactory) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/searchAdd/searchAdd.html',
        link: function (scope) {
            scope.showSearchResults = false;
            scope.search = function(text) {
                return SubmitSongFactory.searchYoutube(text)
                .then(function(searchResults){
                    scope.searchResults = SubmitSongFactory.getSearchResults();
                    scope.showSearchResults = true;
                })
            }
            let socket = SocketFactory.getSocket();
            scope.entry = "A-team";
            scope.add = function(result, user) {
                PlaylistFactory.addSong(result, user)
                    .then(response => {
                        socket.emit("songAdded", {
                            roomId: scope.room._id
                        });
                    });
                scope.toggleShowPlaylist(true);

            }
        }

    };

});
