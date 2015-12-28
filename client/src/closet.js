'use strict';

var url = 'http://images.containerstore.com/medialibrary/images/tcsclosets/slideshow/Image01-TCSClosets-960.jpg';

angular.module('myApp')
  .controller('ClosetCtrl', ['$scope', '$window', '$http', function($scope, $window, $http) {
    $scope.header = 'You will find your closet here';
    $scope.imageUrl = url;
    $scope.username = $window.localStorage.username;
    $scope.imageUrls;  /*will pull an array from database*/
  }]);
