'use strict';

var url = 'http://www.fantasticviewpoint.com/wp-content/uploads/2013/09/street-style-style-motivation-13-620x925.jpg'

angular.module('myApp')
  .controller('MainCtrl', ['$scope','$window', 'Authorization', function($scope, $window, Authorization) {

  	$scope.imageUrl = url;

    $scope.signout = function() {
      console.log('signing out!')
      $window.localStorage.removeItem("authtoken")
      $window.localStorage.removeItem(username)
    }

    // $scope.getImageData = function(link) {
    // 	$http({
    // 		method: 'GET', 
    // 		url: 'images/getImageData',
    // 		data: link
    // 	}).then(function(res) {
    // 		console.log('success')
    // 	})


    // }

    

    // $scope.getAllImages = function() {
    // 	$http({
    // 		method:
    // 	})
    // }

   $scope.isAuth=Authorization.authorized;
  }]);
