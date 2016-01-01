'use strict';

angular.module('myApp')
  .controller('NavCtrl', ['$scope','$window', 'Authorization', function($scope, $window, Authorization) {
    $scope.loggedIn=!!window.localStorage.authtoken;
  }]);
