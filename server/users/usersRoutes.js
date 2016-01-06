var usersController = require('./usersController.js');

module.exports = function (app) {

  app.post('/signin', usersController.signin);
  app.post('/signup', usersController.signup);
  app.post('/closet', usersController.getUserInfo);

};