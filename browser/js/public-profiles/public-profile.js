app.config($stateProvider => {
	$stateProvider.state('publicProfile', {
		url: '/publicProfile/:userId',
		templateUrl: 'js/public-profiles/public-profile-template.html',
		controller: 'PublicProfileCtrl',
		resolve: {
			publicUser: (UserFactory, $stateParams) => {
				return UserFactory.getUserById($stateParams.userId)
						.then(user => {
							return user;
						});
			},
			userPowerups: (publicUser, UserFactory) => {
				let powerUpIcons = {
				    'Chopsticks of Plenty': '/food.svg',
				    'Sword of Ultimate Shame': '/twoswords.svg',
				    'Daggers of Disdain': '/daggerSolid.svg',
				    'Katana of Disgrace': '/sword.svg',
				    'Enlightened Blessing': '/discipline.svg',
				    'Sword of Uncertainty': '/yinyang.svg',
				    'Poison Darts': '/darts.svg',
				    'The Last Jamurai': '/helmet.svg'
				};

				let formatPowerUps = powerUpObj => {
			        return powerUpObj.map(powerup => {
			            let pwrUp = {};
			            pwrUp.name = powerup;
			            pwrUp.icon = powerUpIcons[powerup];
			            return pwrUp;
			        });
			    };

				return UserFactory.getPowerupsByUser(publicUser._id)
				.then(powerups => {
					if (powerups.length > 0) {
						return formatPowerUps(powerups);
					}
					else {
						return [];
					}
				})
			}
		}
	})
})
.controller('PublicProfileCtrl', ($scope, publicUser, UserFactory, userPowerups) => {
	$scope.publicUser = publicUser;
	$scope.userPowerups = userPowerups;

});
