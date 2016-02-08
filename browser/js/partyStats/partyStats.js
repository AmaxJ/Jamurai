app.config(function($stateProvider) {
	$stateProvider.state('partyStats', {
		url: '/partyStats',
		templateUrl: 'js/partyStats/partyStats.html',
		controller: 'partyStats',
		resolve: {
			rooms: function(RoomFactory) {
				return RoomFactory.getAllRooms();
			}
		}
	});
})

app.controller('partyStats', ($scope, RoomFactory, rooms) => {
	$scope.rooms = rooms;
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
		title: 'Overall Song Popularity',
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

	var data1 = {
		series: ['# requests per party'],
		data: []
	}

	var data2 = {
		series: ['overall # of requests'],
		data: []
	}


	var masterSongList = [];
	var overallMasterVzn = [];
	for(var x=0; x<$scope.rooms.length; x++)
	{
		var nonRepeatingPlaylist = [];
		var thisRoom = $scope.rooms[x];
		for(var y=0; y<thisRoom.playlist.songs.length; y++)
		{
			console.log('dat song',thisRoom.playlist.songs[y]);
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
    masterSongList.sort(function(a, b) {
        return b[1] - a[1];
    });
    overallMasterVzn.sort(function(a, b) {
        return b[1] - a[1];
    });
	if(masterSongList.length > 10)
	{
		masterSongList = masterSongList.slice(0,10);
	}
	if(overallMasterVzn.length > 10)
	{
		overallMasterVzn = overallMasterVzn.slice(0,10);
	}

	for(var g=0; g<masterSongList.length; g++)
	{
		var obj = {};
		obj.x = masterSongList[g][0];
		obj.y = [masterSongList[g][1]];
		data1.data.push(obj);
	}

	for(var h=0; h<overallMasterVzn.length; h++)
	{
		var obj = {};
		obj.x = overallMasterVzn[h][0];
		obj.y = [overallMasterVzn[h][1]];
		data2.data.push(obj);
	}

	$scope.getOverallPopularity = function() {
		$scope.data = data2;
		$scope.config = config2;
		$scope.overall = true;
		$scope.singular = false;
	}

	$scope.getSingularPopularity = function() {
		$scope.data = data1;
		$scope.config = config1;
		$scope.singular = true;
		$scope.overall = false;
	}

	$scope.getSingularPopularity();

})
