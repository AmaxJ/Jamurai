app.directive('playerBar', PlayerFactory => {
	return {
		restrict: "E",
		templateUrl: '/js/common/directives/player-bar/player-bar-template.html',
		link(scope, el, attrs) {
			let showVid = true;
			scope.toggleVid = () => {
				showVid = !showVid;
			}
			scope.getVidState = () => showVid;
			scope.play = PlayerFactory.play;
			scope.pause = PlayerFactory.pause;
		}
	}
})

