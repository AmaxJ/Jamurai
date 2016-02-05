app.directive('login', function(AuthService, $state) {
	return {
		restrict: 'E',
		templateUrl: '/js/common/directives/login-directive/login-directive.html'
	}
});