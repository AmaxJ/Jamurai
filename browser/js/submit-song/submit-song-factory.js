app.factory('SubmitSongFactory', ($http)=>{
	var factory = {};
	
	var searchResults;
	factory.searchYoutube = ()=>{
		return $http({
			method: 'GET',
			url: 'https://www.googleapis.com/youtube/v3/search',
			params: {
				q: $scope.search, 
				part: 'snippet', 
				maxResults: 25,
				kind: 'video',
				key:  'AIzaSyBP4BcLHPabkcqMhcvSBhQ93WaCrQzMk1A'
			}
		})
		.then((response)=>{
			searchResults  = response.data.items
		})
	}

	factory.getSearchResults = () => {
		return searchResults;
	}

	return factory;
})