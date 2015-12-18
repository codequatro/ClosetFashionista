'use strict';

angular.module('myApp')
  .controller('AuthCtrl', ['$scope','$http', function($scope,$http) {
    $scope.header = 'this will be the auth page';
  }]);
