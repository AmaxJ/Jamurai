app.config(function($stateProvider) {
	$stateProvider.state('partyStats', {
		url: '/partyStats',
		templateUrl: 'js/partyStats/partyStats.html',
		controller: 'partyStats',
		resolve: {
			rooms: function(RoomFactory) {
				return RoomFactory.getAllRooms();
			},
			users: function(UserFactory) {
				return UserFactory.getAllUsers();
			}
		}
	});
})

app.controller('partyStats', ($scope, RoomFactory, rooms, users) => {
	$scope.rooms = rooms;
	$scope.users = users;
	console.log('rooms',$scope.rooms);

	var config1 = {
    	title: 'Song Popularity by Party',
    	tooltips: true,
    	labels: false,
    	mouseover: function() {},
    	mouseout: function() {},
    	click: function() {},
    	legend: {
      		display: true,
      		position: 'right'
		}
	}

	var config2 = {
		title: 'Most Loved Songs',
		tooltips: true,
		labels: false,
		mouseover: function(){},
		mouseout: function(){},
		click: function(){},
		legend: {
			display: true,
			position: 'right'
		}
	}

	var config3 = {
    	title: 'Most Popular Locations by Parties',
    	tooltips: true,
    	labels: false,
    	mouseover: function() {},
    	mouseout: function() {},
    	click: function() {},
    	legend: {
      		display: true,
      		position: 'right'
		}
	}

	var config4 = {
    	title: 'Most Popular Locations by Users',
    	tooltips: true,
    	labels: false,
    	mouseover: function() {},
    	mouseout: function() {},
    	click: function() {},
    	legend: {
      		display: true,
      		position: 'right'
		}
	}

	var config5 = {
    	title: 'Most Hated Songs',
    	tooltips: true,
    	labels: false,
    	mouseover: function() {},
    	mouseout: function() {},
    	click: function() {},
    	legend: {
      		display: true,
      		position: 'right'
		}
	}

	var data1 = {
		series: ['# requests per party'],
		data: []
	}

	var data2 = {
		series: ['vote score'],
		data: []
	}

	var data3 = {
		series: ['Location'],
		data: []
	}

	var data4 = {
		series: ['Location'],
		data: []
	}

	var data5 = {
		series: ['vote score'],
		data: []
	}


	var masterSongList = [];
	var hateCopy = [];
	var overallMasterVzn = [];
	var roomLocList = [];
	for(var x=0; x<$scope.rooms.length; x++)
	{
		var nonRepeatingPlaylist = [];
		var thisRoom = $scope.rooms[x];
		var thisLoc = $scope.rooms[x].normalLocation;
		var locExists = false;
		if(thisLoc)
		{
			for(var m=0; m<roomLocList.length; m++)
			{
				if(roomLocList[m][0]===thisLoc)
				{
					roomLocList[m][1]++;
					locExists = true;
					break;
				}
			}
			if(!locExists)
			{
				roomLocList.push([thisLoc,1]);
			}
		}
		for(var y=0; y<thisRoom.playlist.songs.length; y++)
		{
			var thisSong = thisRoom.playlist.songs[y].song.title
			if(thisSong.length > 25)
			{
				thisSong = thisSong.substring(0,20);
			}
			var idx = nonRepeatingPlaylist.indexOf(thisSong);
			if(idx === -1)
			{
				nonRepeatingPlaylist.push(thisSong);
				var foundInMaster = false;
				for(var i=0; i<masterSongList.length; i++)
				{
					if(masterSongList[i][0]===thisSong)
					{
						masterSongList[i][1]++;
						foundInMaster = true;
						break;
					}
				}
				if(!foundInMaster)
				{
					masterSongList.push([thisSong,1]);
				}
				var foundInMasterVzn = false;
				for(var j=0; j<overallMasterVzn.length; j++)
				{
					if(overallMasterVzn[j][0]===thisSong)
					{
						overallMasterVzn[j][1]+= thisRoom.playlist.songs[y].total;
						foundInMasterVzn = true;
						break;
					}
				}
				if(!foundInMasterVzn)
				{
					overallMasterVzn.push([thisSong,thisRoom.playlist.songs[y].total]);
				}
			}
		}
	}
	for(var m=0; m<overallMasterVzn.length; m++)
	{
		hateCopy.push(overallMasterVzn[m]);
	}
	var userLocList = [];
	for(var t=0; t<$scope.users.length; t++)
	{
		var userLoc = $scope.users[t].normalizedLocation;
		var locFound = false;
		for(var r=0; r<userLocList.length; r++)
		{
			if(userLocList[r][0]===userLoc)
			{
				userLocList[r][1]++;
				locFound = true;
				break;
			}
		}
		if(!locFound)
		{
			userLocList.push([userLoc,1]);
		}

	}
	hateCopy.sort(function(a, b) {
		return a[1] - b[1];
	})
    masterSongList.sort(function(a, b) {
        return b[1] - a[1];
    });
    overallMasterVzn.sort(function(a, b) {
        return b[1] - a[1];
    });
    roomLocList.sort(function(a, b) {
    	return b[1] - a[1];
    });
    userLocList.sort(function(a, b) {
    	return b[1] - a[1];
    });
    if(hateCopy.length > 10)
    {
    	hateCopy = hateCopy.slice(0,10);
    }
	if(masterSongList.length > 10)
	{
		masterSongList = masterSongList.slice(0,10);
	}
	if(overallMasterVzn.length > 10)
	{
		overallMasterVzn = overallMasterVzn.slice(0,10);
	}
	if(roomLocList.length > 10)
	{
		roomLocList = roomLocList.slice(0,10);
	}
	if(userLocList.length > 10)
	{
		userLoc = userLocList.slice(0,10);
	}


	for(var g=0; g<masterSongList.length; g++)
	{
		var obj = {};
		obj.x = masterSongList[g][0];
		obj.y = [masterSongList[g][1]];
		data1.data.push(obj);
	}

	for(var g=0; g<hateCopy.length; g++)
	{
		var obj = {};
		obj.x = hateCopy[g][0];
		obj.y = [hateCopy[g][1]];
		data5.data.push(obj);
	}

	for(var h=0; h<overallMasterVzn.length; h++)
	{
		var obj = {};
		obj.x = overallMasterVzn[h][0];
		obj.y = [overallMasterVzn[h][1]];
		data2.data.push(obj);
	}

	for(var g=0; g<roomLocList.length; g++)
	{
		var obj = {};
		obj.x = roomLocList[g][0];
		obj.y = [roomLocList[g][1]];
		data3.data.push(obj);
	}

	for(var i=0; i<userLocList.length; i++)
	{
		var obj = {};
		obj.x = userLocList[i][0];
		obj.y = [userLocList[i][1]];
		data4.data.push(obj);
	}
	console.log('d1',masterSongList);
	console.log('d5',hateCopy);

	$scope.getOverallPopularity = function() {
		$scope.data = data2;
		$scope.config = config2;
		// $scope.overall = true;
		// $scope.singular = false;
	}

	$scope.getSingularPopularity = function() {
		$scope.data = data1;
		$scope.config = config1;
		// $scope.singular = true;
		// $scope.overall = false;
	}

	$scope.getHatedSongs = function() {
		$scope.data = data5;
		$scope.config = config5;
	}

	$scope.getRoomLocPop = function() {
		$scope.data2 = data3;
		$scope.config2 = config3;
		// $scope.roomVzn = true;
		// $scope.userVzn = false;
	}

	$scope.getUserLocPop = function() {
		$scope.data2 = data4;
		$scope.config2 = config4;
		// $scope.userVzn = true;
		// $scope.roomVzn = false;
	}

	$scope.getSingularPopularity();
	$scope.getRoomLocPop();



});
