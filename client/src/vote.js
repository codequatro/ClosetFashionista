'use strict';

angular.module('myApp')
  .controller('VoteCtrl', ['$scope','$http', function($scope,$http) {
    $scope.header = 'I am ready to vote on ugly fools';
  }]);
