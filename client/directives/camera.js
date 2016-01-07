angular.module('myApp')
  .directive('camera', function(){
    return {
      restrict: 'E',
      scope: {
        info: '='
      },
      templateUrl: '../client/views/camera.html'
    };
  });
