'use strict';

angular.module('myApp')
  .controller('VoteCtrl', ['$scope','$http', '$window','Register', function($scope,$http,$window,Register) {
    $scope.header = 'Are you ready to vote on ugly fools?';
    $scope.updated = false;
    $scope.hotOrNot = 0;

    $scope.getImage = function(){
    	Register.register.randomImage()
    	.then(function(data){
    		$scope.imageUrl = '../uploads/' + data.image_name;
    		$scope.imageId = data.image_id;
    	})
    };

    $scope.username = $window.localStorage.getItem('username');

    $scope.vote = function(){
    	console.log('$scope.imageId', $scope.imageId, 'current vote', $scope.hotOrNot);
    	Register.register.vote($scope.hotOrNot, $scope.username, $scope.imageId)
    	.then(function(data){
    		$scope.updated = true;
            $scope.getImage();
    	})
    };


  }]);
