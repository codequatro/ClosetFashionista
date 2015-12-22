'use strict';


angular.module('myApp')
  .controller('ClosetCtrl', ['$scope','$http', function($scope,$http) {
    $scope.header = 'You will find your closet here';
    $scope.imageUrls;  /*will pull an array from database*/
  }]);
