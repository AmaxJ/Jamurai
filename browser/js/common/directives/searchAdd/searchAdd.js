app.directive('searchAdd', (SubmitSongFactory, PlaylistFactory, SocketFactory) => {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/searchAdd/searchAdd.html',
        link(scope) {
            scope.showSearchResults = false;
            scope.search = (text) => {
                return SubmitSongFactory.searchYoutube(text)
                .then(searchResults =>{
                    scope.searchResults = SubmitSongFactory.getSearchResults();
                    scope.showSearchResults = true;
                })
            }
            let socket = SocketFactory.getSocket();
            scope.entry = "A-team";
            scope.add = (result, user) => {
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
