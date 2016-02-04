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

	$scope.config = {
    	title: 'Song Popularity by Party',
    	tooltips: true,
    	labels: false,
    	mouseover: function() {},
    	mouseout: function() {},
    	click: function() {},
    	legend: {
      		display: true,
      		//could be 'left, right'
      		position: 'right'
		}
    };
	$scope.data = {
		series: ['parties requested in'],
		data:[]
	}
	var masterSongList = [];
	for(var x=0; x<$scope.rooms.length; x++)
	{
		var nonRepeatingPlaylist = [];
		var thisRoom = $scope.rooms[x];
		for(var y=0; y<thisRoom.playlist.songs.length; y++)
		{
			var thisSong = thisRoom.playlist.songs[y].song.title
			if(thisSong.length > 25)
			{
				thisSong = thisSong.substring(0,25);
			}
			console.log('song',$scope.rooms[x].playlist.songs[y].song.title);
			var idx = nonRepeatingPlaylist.indexOf(thisSong);
			if(idx === -1)
			{
				nonRepeatingPlaylist.push(thisSong);
				var foundInMaster = false;
				for(var i=0; i<masterSongList.length; i++)
				{
					if(masterSongList[i][0]===thisSong)
					{
						masterSongList[i][1]++
						foundInMaster = true;
						break;
					}
				}
				if(!foundInMaster)
				{
					masterSongList.push([thisSong,1]);
				}
			}
		}
	}
	for(var u=0; u<masterSongList.length; u++)
	{
		var thisSongPopularity = masterSongList[u][1];
		for(var v=u+1; v<masterSongList.length; v++)
		{
			var otherSongPopularity = masterSongList[v][1];
			if(otherSongPopularity>thisSongPopularity)
			{
				var temp = masterSongList[u];
				masterSongList[u] = masterSongList[v];
				masterSongList[v] = temp;
			}
		}
	}
	if(masterSongList.length > 10)
	{
		masterSongList = masterSongList.slice(0,10);
	}
	for(var u=0; u<masterSongList.length; u++)
	{
		var obj = {};
		obj.x = masterSongList[u][0];
		obj.y = [masterSongList[u][1]];
		$scope.data.data.push(obj);
	}
	console.log($scope.data)
})