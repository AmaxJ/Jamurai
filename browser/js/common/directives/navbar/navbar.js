app.directive('navbar', ($rootScope, AuthService, AUTH_EVENTS, $state, PlayerFactory) => {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: (scope) => {

            scope.items = [
                { label: 'Lobby', state: 'lobby' },
                { label: 'Profile', state: 'profile' },
                { label: 'Analytics', state: 'analytics'}
            ];

            scope.user = null;

            scope.isLoggedIn = () => {
                return AuthService.isAuthenticated();
            };

            scope.logout = () => {
                AuthService.logout().then(() => {
                   $state.go('home');
                });
            };

            let setUser = function () {
                AuthService.getLoggedInUser().then(user => {
                    scope.user = user;
                });
            };

            let removeUser = () => {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
