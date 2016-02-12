app.directive('login', (AuthService, $state) => {
	return {
		restrict: 'E',
		templateUrl: '/js/common/directives/login-directive/login-directive.html'
	}
});