app.factory('RoomFactory', function($http){
	var factory = {};

	var showForm = false;

	factory.getRoomState = () => {
		return showForm;
	};

	factory.showForm = () => {
		showForm = true;
	};

	factory.createNewRoom = (newRoom) => {
		return $http({
			method: 'POST',
			url: '/api/rooms/',
			data: newRoom
		})
		.then(function(response){
			console.log(response);
			// return response.data;
		})
	}


	return factory;
})