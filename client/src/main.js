'use strict';

var url = 'http://www.fantasticviewpoint.com/wp-content/uploads/2013/09/street-style-style-motivation-13-620x925.jpg'

angular.module('myApp')
  .controller('MainCtrl', ['$scope', function($scope) {
  	$scope.imageUrl = url;
  }]);
