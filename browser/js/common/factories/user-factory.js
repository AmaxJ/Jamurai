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

	factory.getAllUsers = (id) => {
		return $http({
			method: 'GET',
			url: '/api/users'
		})
		.then((response) => {
			return response.data;
		})
	}

	factory.getPowerUps = (userId, roomId) => {
		return $http({
			method: 'GET',
			url: `/api/users/${userId}/${roomId}/powerup`
		})
		.then(response => {
			console.log('POWER UPS?', response.data)
			return response.data
		});
	}

	return factory;
});