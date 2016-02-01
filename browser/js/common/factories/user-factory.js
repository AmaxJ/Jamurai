app.factory('UserFactory', function($http){
	var factory = {};

	factory.getUserById = (id) => {
		return $http({
			method: 'GET',
			url: '/api/users/' + id
		})
		.then((response) => {
			return response.data;
		})
	}

	return factory;
})