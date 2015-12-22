'use strict';

angular.module('myApp', [
    'ui.router'
  ])

    .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })

        .state('vote', {
          url: '/vote',
          templateUrl: 'views/vote.html',
          controller: 'VoteCtrl'
        })

        .state('auth', {
          url:'/auth',
          templateUrl: 'views/auth.html',
          controller: 'AuthCtrl'
        })

        .state('closet', {
          url: '/closet',
          templateUrl: 'views/closet.html',
          controller: 'ClosetCtrl'
        })

});


 .factory('Register', function($http, $window){
    var register = {};
    register.currentUser =  $window.localStorage.getItem('username') || '' ;
    register.users = [];

    register.updateProfile = function(userObj){
      // register.users.push(userObj);
      // console.log(register);
      return $http({
        method: 'POST',
        url: '/updateprofile',
        data: userObj
      })
      .then(function(resp){
        return resp.data;
      })
    };

    register.signup = function(user) {
      return $http({
        method: 'POST',
        url: '/signup',
        data: user
      })
      .then(function(resp){
        return resp.data;
      })
    };

    register.signin = function(user){
      return $http({
        method: 'POST',
        url: '/signin',
        data: user
      })
      .then(function(resp){
        return resp.data;
      })
    };

    register.isAuth = function() {
      return !!$window.localStorage.getItem('lunchAnyone');
    };

    return {
      register: register
    }
  })
.run(function($window, $location, $rootScope){
  $rootScope.signout = function(){
    $window.localStorage.removeItem('lunchAnyone');
    $window.localStorage.removeItem('username');
    console.log('logout');
    $location.path('/signin');
  }
})
