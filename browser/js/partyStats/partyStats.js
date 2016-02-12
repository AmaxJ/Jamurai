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
	$scope.data = [];
	$scope.data2 = [];
	$scope.rooms = rooms;
	$scope.users = users;

	var options1 = {
	 chart: {
            type: 'discreteBarChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 50,
                left: 50
            },
            x: function(d){return d.label},
            y: function(d){return d.value + (1e-10)},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.4f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: 'Song',
                css: {
                    'color': 'white'
                }
            },
            yAxis: {
                axisLabel: 'Number of Parties Requested at',
                axisLabelDistance: -10
            }
        }
	}

	var options2 = {
	 chart: {
            type: 'discreteBarChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 100,
                left: 100
            },
            x: function(d){return d.label},
            y: function(d){return d.value + (1e-10)},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.4f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: 'Song',
            },
            yAxis: {
                axisLabel: 'Vote Score',
                axisLabelDistance: -10
            }
        }
	}


	var options3 = {
	 chart: {
            type: 'discreteBarChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 100,
                left: 100
            },
            x: function(d){return d.label},
            y: function(d){return d.value + (1e-10)},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.4f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: 'Location'
            },
            yAxis: {
                axisLabel: 'Number of Parties',
                axisLabelDistance: -10
            }
        }
	}

	var options4 = {
	 chart: {
            type: 'discreteBarChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 100,
                left: 100
            },
            x: function(d){return d.label},
            y: function(d){return d.value + (1e-10)},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.4f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: 'Location'
            },
            yAxis: {
                axisLabel: 'Number of Users',
                axisLabelDistance: -10
            }
        }
	}

	var options5 = {
	 chart: {
	 		title: 'Most Hated Songs',
            type: 'discreteBarChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 100,
                left: 100
            },
            x: function(d){
            	return d.label},
            y: function(d){return d.value + (1e-10)},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.4f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: 'Song'
            },
            yAxis: {
                axisLabel: 'Vote Score',
                axisLabelDistance: -10
            }
        }
	}

	var data1 = [{
		key: '# requests per party',
		values: []
	}]

	var data2 = [{
		key: 'vote score',
		values: []
	}]

	var data3 = [{
		key: 'Location',
		values: []
	}]

	var data4 = [{
		key: 'Location',
		values: []
	}]

	var data5 = [{
		key: 'vote score',
		values: []
	}]

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
		obj.label = masterSongList[g][0];
		obj.value = masterSongList[g][1];
		data1[0].values.push(obj);
	}

	for(var g=0; g<hateCopy.length; g++)
	{
		var obj = {};
		obj.label = hateCopy[g][0];
		obj.value = hateCopy[g][1];
		data5[0].values.push(obj);
	}

	for(var h=0; h<overallMasterVzn.length; h++)
	{
		var obj = {};
		obj.label = overallMasterVzn[h][0];
		obj.value = overallMasterVzn[h][1];
		data2[0].values.push(obj);
	}

	for(var g=0; g<roomLocList.length; g++)
	{
		var obj = {};
		obj.label = roomLocList[g][0];
		obj.value = roomLocList[g][1];
		data3[0].values.push(obj);
	}

	for(var i=0; i<userLocList.length; i++)
	{
		var obj = {};
		obj.label = userLocList[i][0];
		obj.value = userLocList[i][1];
		data4[0].values.push(obj);
	}

	$scope.getOverallPopularity = function() {
		$scope.data = data2;
		$scope.options = options2;
	}

	$scope.getSingularPopularity = function() {
		$scope.data = data1;
		$scope.options = options1;
	}

	$scope.getHatedSongs = function() {
		$scope.data = data5;
		$scope.options = options5;
	}

	$scope.getRoomLocPop = function() {
		$scope.data2 = data3;
		$scope.options2 = options3;
	}

	$scope.getUserLocPop = function() {
		$scope.data2 = data4;
		$scope.options2 = options4;
	}

	$scope.getSingularPopularity();
	$scope.getRoomLocPop();



})
