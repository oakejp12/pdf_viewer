angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', { templateUrl: '/partials/main', controller: 'mainCtrl' });
});


angular.module('app').controller('mainCtrl', function($scope, $routeParams, $window){
    $scope.myVar = 'Hello Angular';
});


// TODO : Make all links into partials so we can create a single page application
angular.module('app').controller('urlCtrl', function($scope, $log, $window){
    $scope.redirect = function(path) {
        var url = "http://" + $window.location.host + path;
        $log.log(url);
        $window.location.href = url;
    };
});