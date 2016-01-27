app.directive('playlist', function() {
	return {
		restrict: 'E',
		templateUrl: '/js/common/directives/playlist/playlist-template.html',
		scope: {
			song: '='
		}
	}
})