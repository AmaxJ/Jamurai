app.factory('RoomFactory', function($http){
	var factory = {};

	var showForm = false;

	factory.getRoomState = () => {
		return showForm;
	};

	factory.showForm = () => {
		showForm = true;
	};

	factory.getAllRooms = () => {
		return $http({
			method: 'GET',
			url: '/api/rooms/'
		})
		.then((response)=> {
			return response.data;
		})
	}

	factory.createNewRoom = (newRoom) => {
		return $http({
			method: 'POST',
			url: '/api/rooms/',
			data: newRoom
		})
		.then((response) => {
			return response.data;
		})
	}

	factory.getRoomById = (roomId) => {
		return $http({
			method: 'GET',
			url: '/api/rooms/' + roomId
		})
		.then((response) => {
			return response.data;
		})
	}


	return factory;
})