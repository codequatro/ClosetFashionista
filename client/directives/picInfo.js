angular.module('myApp')
  .directive('picInfo', function(){
    return {
      restrict: 'E',
      scope: {
        info: '='
      },
      templateUrl: '../client/views/picInfo.html'
    };
  });