angular.isUndefinedOrNull = function(val) {
    return angular.isUndefined(val) || val === null;
};

angular.module('grisu-noe', ['ionic', 'ngCordova', 'leaflet-directive'])

.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
    $ionicConfigProvider.views.transition('ios');

    $ionicConfigProvider.tabs.style('standard');
    $ionicConfigProvider.tabs.position('bottom');

    $ionicConfigProvider.backButton.icon('ion-arrow-left-c');
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.previousTitleText(false);

    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.navBar.positionPrimaryButtons('left');
    $ionicConfigProvider.navBar.positionSecondaryButtons('right');

    $stateProvider.state('tabs', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    });

    $stateProvider.state('tabs.overview', {
        url: '/overview',
        views: {
            'overview-tab': {
                templateUrl: 'templates/overview.html',
                controller: 'overviewTabController'
            }
        }
    });

    // ionic doesn't support nested states/views very well yet.
    // so we are faking nested states with conventions
    $stateProvider.state('tabs.overview-incidents', {
        url: '/overview-incidents/:districtName/:id',
        views: {
            'overview-tab': {
                templateUrl: 'templates/incidents.html',
                controller: 'incidentsListController'
            }
        }
    });

    $stateProvider.state('tabs.overview-history', {
        url: '/overview-history',
        views: {
            'overview-tab': {
                templateUrl: 'templates/history.html',
                controller: 'historyController'
            }
        }
    });

    $stateProvider.state('tabs.overview-incident', {
        url: '/overview-incident/:districtId/:incidentId',
        views: {
            'overview-tab': {
                templateUrl: 'templates/incident.html',
                controller: 'incidentController'
            }
        }
    });

    $stateProvider.state('tabs.overview-extended-incident', {
        url: '/overview-extended-incident/:districtId/:extendedIncidentId/:isHistoricIncident',
        views: {
            'overview-tab': {
                templateUrl: 'templates/extended-incident.html',
                controller: 'extendedIncidentController'
            }
        }
    });

    $stateProvider.state('tabs.districts', {
        url: '/districts',
        views: {
            'districts-tab': {
                templateUrl: 'templates/districts.html',
                controller: 'districtsTabController'
            }
        }
    });

    $stateProvider.state('tabs.districts-incidents', {
        url: '/district-incidents/:id',
        views: {
            'districts-tab': {
                templateUrl: 'templates/incidents.html',
                controller: 'incidentsListController'
            }
        }
    });

    $stateProvider.state('tabs.districts-incident', {
        url: '/district-incident/:districtId/:incidentId',
        views: {
            'districts-tab': {
                templateUrl: 'templates/incident.html',
                controller: 'incidentController'
            }
        }
    });

    $stateProvider.state('tabs.districts-extended-incident', {
        url: '/district-extended-incident/:districtId/:extendedIncidentId/:isHistoricIncident',
        views: {
            'districts-tab': {
                templateUrl: 'templates/extended-incident.html',
                controller: 'extendedIncidentController'
            }
        }
    });

    $stateProvider.state('tabs.water', {
        url: '/water',
        views: {
            'water-tab': {
                templateUrl: 'templates/water.html',
                controller: 'waterTabController'
            }
        }
    });

    $stateProvider.state('tabs.statistics', {
        url: '/statistics',
        views: {
            'statistics-tab': {
                templateUrl: 'templates/statistics.html',
                controller: 'statisticsTabController'
            }
        }
    });

    $urlRouterProvider.otherwise('/tab/overview');
})

.run(function($ionicPlatform, $window, $rootScope, $timeout, $cordovaSplashscreen, $cordovaDevice) {
    $ionicPlatform.ready(function () {

        if ($window.cordova) {
            $timeout(function() {
                console.debug("hiding splash screen");
                $cordovaSplashscreen.hide();
            }, 1000);
        }

        if ($window.StatusBar) {
            $window.StatusBar.styleLightContent();
        }

        document.addEventListener('resume', function() {
            console.debug('Resuming app. Broadcasting event.');
            $rootScope.$broadcast('cordova.resume');
        }, false);
		
        /** opens a native web browser with given url supported by the running OS */
        $rootScope.openBrowser = function(url) {
            $window.open(url, '_system');
        };

        /** indicator for initial view change (my district) */
        $rootScope.alreadyJumpedToDistrict = false;

        /** detect Android version and disable map if < 4.4 KitKat (SVG support) */
        $rootScope.showMap = true;
        if ($window.cordova && $cordovaDevice.getPlatform() === 'Android') {
            var version = parseFloat($cordovaDevice.getVersion().substr(0, 3));
            if (version < 4.4) {
                $rootScope.showMap = false;
            }
        }
    });
});