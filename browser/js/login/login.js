app.config($stateProvider => {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', ($scope, AuthService, $state) => {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = (loginInfo) => {

        $scope.error = null;
        
        AuthService.login(loginInfo).then(() => {
            $state.go('lobby');
        }).catch(() => {
            $scope.error = 'Invalid login credentials.';
        });
    };
});