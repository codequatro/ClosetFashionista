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

        .state('signin', {
          url:'/signin',
          templateUrl: 'views/signin.html',
          controller: 'AuthCtrl'
        })

        .state('signup', {
          url:'/signup',
          templateUrl: 'views/signup.html',
          controller: 'AuthCtrl'
        })

        .state('signout', {
          url:'/signout',
          templateUrl: 'views/signout.html',
          controller: 'AuthCtrl'
        })

        .state('vote', {
          url: '/vote',
          templateUrl: 'views/vote.html',
          controller: 'VoteCtrl',
          data: {
            authorization: true,
            redirectTo: 'signin'
          }
        })

        .state('closet', {
          url: '/closet',
          templateUrl: 'views/closet.html',
          controller: 'ClosetCtrl',
          data: {
            authorization: true,
            redirectTo: 'signin'
          }
        })

        .state('s3test', {
          url: '/s3test',
          templateUrl: 'views/s3test.html',
          controller: 'S3Ctrl'
        })

})
.service('Authorization', function($state, $window) {

  if ($window.localStorage.authtoken) {
    this.authorized = true;
  } else {
    this.authorized = false;
  }

  var go = function(fallback){
    this.authorized = true;
    var targetState = this.memorizedState ? this.memorizedState : fallback;
    $state.go(targetState);
  };

  return {
    authorized: this.authorized,
    go: go
  };
})
.run( function($rootScope, $state, Authorization) {
    // register listener to watch route changes
    $rootScope.$on( '$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      // console.log('state is changing!', toState)
      if (toState.data !== undefined) {

        if (Authorization.authorized) {

          $state.go(toState.name)

        } else {

          $state.go(toState.data.redirectTo);
    }
  }
    });
  })

 .factory('Register', function($http, $window){
    var register = {};  // local storage for users and current user

    register.currentUser =  $window.localStorage.getItem('username') || '' ;
    register.users = [];

    /***************AUTHORIZATION***********************/
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
    /***************AUTHORIZATION***********************/

    /*****************VOTING ON IMAGE*******************/
    register.randomImage = function(){
      return $http({
        method: 'GET',
        url: '/randomimage'
      })
      .then(function(resp){
        return resp.data;
      })
    }

    register.vote = function(hotOrNot, username, imageId){
      console.log('Factory Image ID', imageId);
      return $http({
        method: 'POST',
        url: '/vote',
        data: {hotOrNot: hotOrNot, username: username, imageId: imageId}
      })
      .then(function(resp){
        return resp.data;
      })
    }
    /*****************VOTING ON IMAGE*******************/

    /*************GET CLOSET IMAGES********************/
    register.getCloset = function(user){
      return $http({
        method: 'POST',
        url: '/closet',
        data: {username: user}
      })
      .then(function(resp){
        return resp.data;
      })
    };
    /*************GET CLOSET IMAGES********************/

    return {
      register: register
    }
  })

; // end of app.js

