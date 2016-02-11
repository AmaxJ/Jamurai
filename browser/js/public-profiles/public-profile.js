app.config(function ($stateProvider) {
	$stateProvider.state('publicProfile', {
		url: '/publicProfile/:userId',
		templateUrl: 'js/public-profiles/public-profile-template.html',
		controller: 'PublicProfileCtrl',
		resolve: {
			publicUser: (UserFactory, $stateParams) => {
				return UserFactory.getUserById($stateParams.userId)
						.then((user) => {
							return user;
						});
			}
		}
	})
})
.controller('PublicProfileCtrl', function($scope, publicUser, UserFactory){

	let formatPowerUps = powerUpObj => {
        return powerUpObj.map(powerup => {
            let pwrUp = {};
            pwrUp.name = powerup;
            pwrUp.icon = powerUpIcons[powerup];
            return pwrUp;
        });
    }

	let powerUpIcons = {
	    'Chopsticks of Plenty': '/food.svg',
	    'Sword of Ultimate Shame': '/twoswords.svg',
	    'Daggers of Disdain': '/daggerSolid.svg',
	    'Katana of Disgrace': '/sword.svg',
	    'Enlightened Blessing': '/discipline.svg',
	    'Sword of Uncertainty': '/yinyang.svg',
	    'Poison Darts': '/darts.svg',
	    'The Last Jamurai': '/helmet.svg'
	}

	$scope.publicUser = publicUser;
	$scope.userPowerups;

	UserFactory.getPowerupsByUser(publicUser._id)
	.then(powerups => {
		$scope.userPowerups = formatPowerUps(powerups);
	})

});
