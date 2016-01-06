'use strict';

angular.module('myApp')
  .controller('NavCtrl', ['$scope','$window', 'Authorization', function($scope, $window, Authorization) {
   $scope.isAuth = Authorization.authorized;
  }]);
