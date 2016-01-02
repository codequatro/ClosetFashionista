'use strict';

angular.module('myApp')
  .controller('VoteCtrl', ['$scope','$http', '$window','Register', function($scope,$http,$window,Register) {
    $scope.header = 'Are you ready to vote on ugly fools?';
    $scope.updated = false;
    // $scope.hotOrNot;
    $scope.username = $window.localStorage.getItem('username');

    $scope.getImage = function(){
    	Register.register.randomImage($scope.username)
    	.then(function(data){
    		$scope.imageUrl = data.image_name;
    		$scope.imageId = data.image_id;
    	})
    };

    $scope.username = $window.localStorage.getItem('username');

    $scope.vote = function(voteValue){
    	console.log('$scope.imageId', $scope.imageId, 'current vote', voteValue);
    	Register.register.vote(voteValue, $scope.username, $scope.imageId)
    	.then(function(data){
    		$scope.updated = true;
            $scope.getImage();
    	})
    };


  }]);
