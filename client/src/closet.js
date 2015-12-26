'use strict';

var url = 'http://images.containerstore.com/medialibrary/images/tcsclosets/slideshow/Image01-TCSClosets-960.jpg';

angular.module('myApp')
  .controller('ClosetCtrl', ['$scope','$http', function($scope, $http) {
    $scope.header = 'You will find your closet here';
    $scope.imageUrl = url;
    $scope.imageUrls;  /*will pull an array from database*/
  }]);
