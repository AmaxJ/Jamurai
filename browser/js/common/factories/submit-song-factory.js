app.factory('SubmitSongFactory', ($http)=>{
	let factory = {};

	let searchResults;
	factory.searchYoutube = (searchParams)=>{
		return $http({
			method: 'GET',
			url: 'https://www.googleapis.com/youtube/v3/search',
			params: {
				q: searchParams,
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
});




