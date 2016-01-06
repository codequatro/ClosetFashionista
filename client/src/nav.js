'use strict';

angular.module('myApp')
  .controller('NavCtrl', ['$scope','$window', 'Authorization', 'Register', function($scope, $window, Authorization, Register) {
   $scope.isAuth=Authorization.authorized;

   // data storage
   // $scope.userID = $window.localStorage.getItem('userID');

   	$scope.firstModalShow = true;
	$scope.changeFirstModal = function() {
		$scope.firstModalShow = $scope.firstModalShow === false ? true : false;
	};

   	$scope.secondModalShow = false;
	$scope.changeSecondModal = function() {
		$scope.secondModalShow = $scope.secondModalShow === false ? true : false;
	};

	$scope.getImageData = function(link) {
    	Register.register.getImageData({ url: link, user_id: $scope.userID })
    	.then(function(data) {
    		$scope.image_name = data.image_name;
    		$scope.image = data.image;
    		$scope.link_url = data.link_url;
    		$scope.source = data.source;
    		$scope.user_id = data.user_id;
    		$scope.changeFirstModal();
    		$scope.changeSecondModal();
    		console.log('getImageData', data)
    	})
    };

    $scope.getAllImages = function() {
    	Register.register.getAllImages()
    	.then(function(data) {
    		$scope.images = data;
    		console.log('main.js', data)
    		return data;
    	})
    };

    $scope.postImage = function(data) {
    	var imageData = {};
    	imageData.image_Url = $scope.image_Url;
    	imageData.link_Url = $scope.link_Url;
    	imageData.image_name = $scope.image_name;
    	Register.register.postImage(imageData)
    	.then(function(data) {
    		return data; 
    	})
    };
  }]);
