'use strict';

angular.module('myApp', [
    'ui.router'
  ])

    .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/closet');

    $stateProvider

      .state('home', {
          url: '/',
          views: {
            "nav": {templateUrl: "views/nav.html"},
            "main":{templateUrl: 'views/main.html'}
          }
      })

      .state('signin', {
        url:'/signin',
        views: {
            "nav": {templateUrl: "views/nav.html"},
            "main":{templateUrl: 'views/signin.html'}
          }
      })

      .state('signup', {
        url:'/signup',
        views: {
            "nav": {templateUrl: "views/nav.html"},
            "main":{templateUrl: 'views/signup.html'}
          }
      })

      .state('signout', {
        url:'/signout',
        views: {
            "nav": {templateUrl: "views/nav.html"},
            "main":{templateUrl: 'views/signout.html'}
          }
      })

      .state('vote', {
        url: '/vote',
        views: {
            "nav": {templateUrl: "views/nav.html"},
            "main":{templateUrl: 'views/vote.html'}
          }
      })

      .state('closet', {
        url: '/closet',
        views: {
            "nav": {templateUrl: "views/nav.html"},
            "main":{templateUrl: 'views/closet.html'}
          }
      })

      .state('s3test', {
        url: '/s3test',
        views: {
            "nav": {templateUrl: "views/nav.html"},
            "main":{templateUrl: 'views/s3test.html'}
          }
      })

})
.service('Authorization', function($state, $window) {
  // This service is a simple version checking for local authtoken
  // and using a state change listener to check on each transistion
  // see .run below for that test
  // It should be tied into a more robust auth check

  if (!!$window.localStorage.authtoken) {
    this.authorized = true;

  } else {
    this.authorized = false;
  }

  return {
    authorized: this.authorized
  };
})
.run( function($rootScope, $location, $state, Authorization) {
    // register listener to watch route changes
    $rootScope.$on( '$locationChangeStart', function(event, next, toState) {

     if(Authorization.authorized === false) {
       if(next.match('vote') || next.match('closet')){
        $location.path('/signin');
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
        url: 'users/signup',
        data: user
      })
      .then(function(resp){
        return resp.data;
      })
    };

    register.signin = function(user){
      return $http({
        method: 'POST',
        url: 'users/signin',
        data: user
      })
      .then(function(resp){
        return resp.data;
      })
    };
    /***************AUTHORIZATION***********************/

    /*****************VOTING ON IMAGE*******************/
    register.randomImage = function(username){
      return $http({
        method: 'POST',
        url: 'images/randomimage',
        data: {username: username}
      })
      .then(function(resp){
        return resp.data;
      })
    }

    register.vote = function(hotOrNot, username, imageId){
      console.log('Factory Image ID', imageId);
      return $http({
        method: 'POST',
        url: 'images/vote',
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
        url: 'users/closet',
        data: {username: user}
      })
      .then(function(resp){
        return resp.data;
      })
    };
    /*************GET CLOSET IMAGES********************/
    register.removeImage = function(imageId, imageName){
      return $http({
        method: 'POST',
        url: 'images/removeimage',
        data: {imageId: imageId, imageName: imageName}
      })
      .then(function(resp){
        return resp.data;
      })
    };
    /***************** AWS S3 ****************************/
    register.s3 = function(params){
      return $http({
      method:'POST',
      url:'/s3test',
      data: {params: params}
      })
      .then(function(resp){
        return resp.data;
      })
    };
    /***************** AWS S3 ****************************/

    return {
      register: register
    }
  })

; // end of app.js

