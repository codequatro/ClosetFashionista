'use strict';

angular.module('myApp')
  .controller('VoteCtrl', ['$scope','$http', '$window','Register', 'Authorization', function($scope, $http, $window, Register , Authorization) {
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

    // initialize page with image if auth is good
    if(Authorization.authorized) {
        $scope.getImage();
    }

  }]);
