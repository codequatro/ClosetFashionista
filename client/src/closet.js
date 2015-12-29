'use strict';

angular.module('myApp')
  .controller('ClosetCtrl', ['$scope','$http', '$window','Register', function($scope,$http,$window,Register) {
    $scope.header = 'You will find your closet here';
    $scope.imageUrl = url;
    $scope.username = $window.localStorage.getItem('username');

    $scope.getCloset = function(){
      Register.register.getCloset($scope.username)
      .then(function(data){
        //data.images is the array of objects. Need to pull image_name from each one of these objects
        $scope.pics = data.images;
      });
    };

  }]);
