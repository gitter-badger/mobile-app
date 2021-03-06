angular.module('grisu-noe').controller('districtsTabController',
    function($scope, dataService, $ionicScrollDelegate, util) {

    $scope.doRefresh = function(loadFromCache) {
        util.genericRefresh($scope, dataService.getMainData(loadFromCache), function(data) {
            $scope.districts = data.Bezirke;
        });
    };

    $scope.$on('cordova.resume', function() {
        $scope.doRefresh(false);
    });

    $scope.$on('$ionicView.enter', function() {
        $scope.doRefresh(true);
    });

    $scope.clearSearch = function() {
        $scope.search = '';
    };
});