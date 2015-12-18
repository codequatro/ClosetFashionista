'use strict';

angular.module('myApp')
  .controller('AuthCtrl', ['$scope','$http', function($scope,$http) {
    $scope.header = 'this will be the auth page';
    $scope.master = {}

    $scope.signin = function(user) {
      console.log(user)

    }

    $scope.reset = function() {
      $scope.user = angular.copy($scope.master)
    }

    $scope.reset();

  }]);
