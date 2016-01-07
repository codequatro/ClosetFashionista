  angular
    .module('myApp')
    .directive('starRating', starRating);

  function starRating($timeout) {
    return {
      restrict: 'EA',
      template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function(scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        }
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            console.log('scope', scope);
            scope.stars.push({
              filled: i < Math.round(scope.ratingValue)
            });
          }
        };
        scope.toggle = function(index) {
          console.log('clicked');
          console.log(index);
          if (scope.readonly == undefined || scope.readonly === false){
            console.log(scope);
            scope.ratingValue = index + 1;
            updateStars();
            scope.onRatingSelect({
              rating: index + 1
            });
          }
        };
        scope.$watch('ratingValue', function(oldValue, newValue) {
          if (newValue) {
            updateStars();
          }
        });
        updateStars();
      }
    };
  }
