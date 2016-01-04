'use strict';

angular.module('myApp')
  .controller('NavCtrl', ['$scope','$window', 'Authorization', function($scope, $window, Authorization) {
   $scope.nugget='NavController hijack!!'
   $scope.isAuth=Authorization.authorized;
  }]);
