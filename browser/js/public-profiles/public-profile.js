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
.controller('PublicProfileCtrl', function($scope, publicUser){
		console.log('publicUSEr ', publicUser);
		$scope.publicUser = publicUser;
});