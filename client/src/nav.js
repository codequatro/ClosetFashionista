'use strict';

angular.module('myApp')
  .controller('NavCtrl', ['$scope','$window', 'Authorization', 'Register', function($scope, $window, Authorization, Register) {
   $scope.isAuth=Authorization.authorized;

   	$scope.modalShow = true;
	$scope.changeModal = function() {
		$scope.modalShow = $scope.modalShow === false ? true : false;
	};

	$scope.getImageData = function(link) {
	 	console.log('clicked')
    	Register.register.getImageData(link)
    	.then(function(data) {
    		$scope.title = data.title;
    		$scope.
    		console.log('data', data)
    	})
    };

    $scope.postImage = function(data) {
    	Register.register.postImage(data)
    	.then(function(data) {
    		console.log(data)
    	})
    };
  }]);
