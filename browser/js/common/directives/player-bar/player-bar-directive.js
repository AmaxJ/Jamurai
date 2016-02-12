app.directive('playerBar', (PlayerFactory) => {
	return {
		restrict: "E",
		templateUrl: '/js/common/directives/player-bar/player-bar-template.html',
		link: (s,e,a) => {
			let showVid = true;
			s.toggleVid = () => {
				showVid = !showVid;
			}
			s.getVidState = () => {
				return showVid;
			}
			s.play = PlayerFactory.play;
			s.pause = PlayerFactory.pause;
		}
	}
})

