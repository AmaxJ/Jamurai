app.config(function($stateProvider) {
	$stateProvider.state('userAnalytics', {
		url: '/userAnalytics',
		templateUrl: 'js/userAnalytics/userAnalytics.html',
		controller: 'userAnalyticsCtrl'
	});
})

app.controller('userAnalyticsCtrl', ($scope, UserFactory) => {
	$scope.labels = [];
	$scope.labels2 = ['under 18','18-25','26-35','36-45','46-55','56-65','over 65'];
	$scope.data2 = [0,0,0,0,0,0,0];
	$scope.data = [];
	$scope.series = ['Series A'];
	UserFactory.getAllUsers()
	.then((users) => {
		var shortenedArr = [];
		for(var x=0; x<users.length; x++)
		{
			var thisUsersLoc = users[x].normalizedLocation;
			var thisUsersAge = users[x].age;
			if(thisUsersLoc)
			{
				var found = false;
				for(var y=0; y<shortenedArr.length; y++)
				{
					if(shortenedArr[y][0]===thisUsersLoc)
					{
						shortenedArr[y][1]++;
						found = true;
					}
				}
				if(!found)
				{
					var arr2Push = [thisUsersLoc,1];
					shortenedArr.push(arr2Push);
				}
			}
			if(thisUsersAge)
			{
				if(thisUsersAge < 18)
				{
					$scope.data2[0]++;
				}
				else if(thisUsersAge >= 18 && thisUsersAge <= 25)
				{
					$scope.data2[1]++;
				}
				else if(thisUsersAge > 25 && thisUsersAge <= 35)
				{
					$scope.data2[2]++;
				}
				else if(thisUsersAge > 35 && thisUsersAge <= 45)
				{
					$scope.data2[3]++;
				}
				else if(thisUsersAge > 45 && thisUsersAge <= 55)
				{
					$scope.data2[4]++;
				}
				else if(thisUsersAge > 55 && thisUsersAge <= 65)
				{
					$scope.data2[5]++;
				}
				else
				{
					$scope.data2[6]++;
				}
			}
			
		}
		for(var i=0; i<shortenedArr.length; i++)
		{
			$scope.labels.push(shortenedArr[i][0]);
			$scope.data.push(shortenedArr[i][1]);
		}
	})
})