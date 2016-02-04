app.config(function($stateProvider) {
	$stateProvider.state('analytics', {
		url: '/analytics',
		templateUrl: 'js/manalytics/analytics.html',
		controller: 'AnalyticsCtrl'
	});
})

app.controller('AnalyticsCtrl', ($scope) => {
	$scope.items = [
		{ label: 'User Analytics', state: 'userAnalytics' },
		{ label: 'Song Analytics', state: 'songAnalytics' },
		{ label: 'Party Stats', state: 'partyStats'}
	]
})