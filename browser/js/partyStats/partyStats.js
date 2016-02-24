app.config($stateProvider => {
    $stateProvider.state('partyStats', {
        url: '/partyStats',
        templateUrl: 'js/partyStats/partyStats.html',
        controller: 'partyStats',
        resolve: {
            stats($http) {
                //maybe this shouldnt be in a resolve since
                //it will be very expensive when a new data object is being created
                return $http.get('/api/statistics')
                    .then(response => response.data);
            }
        }
    });
});

app.controller('partyStats', ($scope, stats) => {
    $scope.data = [];
    var options1 = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 85,
                left: 50
            },
            x(d) {
                return d.label
            },
            y(d) {
                return d.value + (1e-10)
            },
            showValues: true,
            valueFormat(d) {
                return d3.format(',.4f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabelDistance: 25,
                axisLabel: 'Song',
                css: {
                    'color': 'white'
                }
            },
            yAxis: {
                axisLabel: 'Number of Parties Requested at',
                axisLabelDistance: -10
            },
            rotateLabels: 20
        }
    }

    var options2 = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 100,
                left: 100
            },
            x(d) {
                return d.label
            },
            y(d) {
                return d.value + (1e-10)
            },
            showValues: true,
            valueFormat(d) {
                return d3.format(',.4f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabelDistance: 25,
                axisLabel: 'Song',
            },
            yAxis: {
                axisLabel: 'Vote Score',
                axisLabelDistance: -10
            },
            rotateLabels: 20
        }
    }

    var options3 = {
        chart: {
            title: 'Most Hated Songs',
            type: 'discreteBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 100,
                left: 100
            },
            x(d) {
                return d.label
            },
            y(d) {
                return d.value + (1e-10)
            },
            showValues: true,
            valueFormat(d) {
                return d3.format(',.4f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabelDistance: 25,
                axisLabel: 'Song'
            },
            yAxis: {
                axisLabel: 'Vote Score',
                axisLabelDistance: -10
            },
            rotateLabels: 20
        }
    }

    var data1 = [{
        key: '# requests by party',
        values: stats.popularByRoom.map(song => {
            return {
                label : song.title.substring(0, 20),
                value : song.numRoomsRequestedIn
            }
        })
    }]

    var data2 = [{
        key: 'vote score',
        values: stats.topTenSongs.map(song => {
            return {
                label : song.title.substring(0, 20),
                value : song.totalScore
            }
        })
    }]

    var data3 = [{
        key: 'vote score',
        values: stats.bottomTenSongs.map(song => {
            return {
                label : song.title.substring(0, 20),
                value : song.totalScore
            }
        })
    }]

    $scope.getOverallPopularity = function() {
        $scope.data = data2;
        $scope.options = options2;
    }

    $scope.getSingularPopularity = function() {
        $scope.data = data1;
        $scope.options = options1;
    }

    $scope.getHatedSongs = function() {
        $scope.data = data3;
        $scope.options = options3;
    }

    $scope.getSingularPopularity();

});
