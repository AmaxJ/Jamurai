app.directive('searchAdd', function (SubmitSongFactory, PlaylistFactory) {

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
            scope.entry = "A-team";
            scope.add = function(song){
                console.log('GET PLAYLIST',PlaylistFactory.getPlaylist());
                console.log('SONG',song);
                PlaylistFactory.addSong(song);   
            }
        }

    };

});
