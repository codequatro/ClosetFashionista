'use strict';

angular.module('myApp')
  .controller('NavCtrl', ['$scope','$window', '$location', 'Authorization', 'Register', function($scope, $window, $location, Authorization, Register) {

   $scope.isAuth=Authorization.authorized;

   // data storage
    $scope.username = $window.localStorage.getItem('username');
	$scope.userID = $window.localStorage.getItem('userID');
	$scope.image_name = undefined;
	$scope.image = undefined;
	$scope.link_url = undefined;
	$scope.source = undefined;
    $scope.type = undefined;

   	$scope.firstModalShow = false;
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

    $scope.postImage = function() {
        console.log('here')
    	var imageData = {};
        imageData.type = $scope.type;
    	imageData.userID = $scope.userID;
    	imageData.image_name = $scope.image_name;
        imageData.image = $scope.image;
        imageData.link_url = $scope.link_url;
        imageData.source = $scope.source;
        imageData.type = $scope.type;
        console.log('imageData', imageData)
    	Register.register.postImage(imageData)
    	.then(function(data) {
            $scope.changeSecondModal();
            $location.path('closet')
            console.log('data', data)
    		return data; 
    	})
    };
  }]);
