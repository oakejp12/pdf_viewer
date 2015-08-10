'use strict';


angular.module('app').controller('navbarLoginCtrl', function($scope, $http/*, mvIdentity, mvNotifier*/){
    $scope.signin = function(username, password) {
        $http.post('/login', {username: username, password: password}).then(function(res){
            if (res.data.success) {
                mvIdentity.currentUser = response.data.user;
                mvNotifier.notify('You have successfully signed in!');
            } else {
                mvNotifier.notify('Username/Password combination incorrect');
            }
        });
    }
});
