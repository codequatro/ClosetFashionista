'use strict';

var url = 'http://www.fantasticviewpoint.com/wp-content/uploads/2013/09/street-style-style-motivation-13-620x925.jpg'

angular.module('myApp')
  .controller('MainCtrl', ['$scope','$window', function($scope, $window) {
  	$scope.imageUrl = url;
    $scope.signout = function() {
     $window.localStorage.removeItem("authtoken")
     $window.localStorage.removeItem(username)
   }
  }]);
