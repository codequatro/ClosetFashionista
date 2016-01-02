'use strict';

angular.module('myApp')
  .controller('NavCtrl', ['$state','$scope','$window', 'Authorization', function($state, $scope, $window, Authorization) {
    $scope.loggedIn=!!window.localStorage.authtoken;
  }]);
