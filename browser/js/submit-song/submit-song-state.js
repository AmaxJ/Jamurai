app.config(function($stateProvider) {
    $stateProvider.state('submit-song', {
        url: '/submit-song',
        templateUrl: 'js/submit-song/submit-song-template.html',
        resolve: {
            user(AuthService) {
                return AuthService.getLoggedInUser()
                    .then(user => user);
            }
        },
        controller($scope, user) {
            $scope.user = user;
        }
    })
})
