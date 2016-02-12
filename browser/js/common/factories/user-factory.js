app.factory('UserFactory', function($http){
	var factory = {};

	factory.getUserById = id => {
		return $http({
			method: 'GET',
			url: '/api/users/' + id
		})
		.then(response => {
			return response.data;
		})
	}

	factory.updateUser = (id,data) => {
		return $http({
			method: 'PUT',
			url: '/api/users/' + id,
			data: data
		})
		.then(response => {
			return response.data;
		})
	}

	factory.getAllUsers = () => {
		return $http({
			method: 'GET',
			url: '/api/users'
		})
		.then(response => {
			return response.data;
		})
	}


	factory.getPowerupsByUser = (userId) => {
		return $http({
			method: 'GET',
			url: '/api/users/' + userId + '/powerup'
		})
		.then(response => {
			return response.data;
		})
	}

	return factory;
});
