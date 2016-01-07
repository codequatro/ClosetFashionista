'use strict';

angular.module('myApp')
  .controller('SingleOutfitCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
    $scope.singleImageUrl = 'client/uploads/' + $stateParams.imageUrl;
  }]);
