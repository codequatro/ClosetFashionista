angular.module('myApp')
  .directive('picInfo', function(){
    return {
      restrict: 'E',
      scope: {
        info: '='
      },
      templateUrl: '../views/picInfo.html'
    };
  });
