var usersController = require('./usersController.js');

module.exports = function (app) {
  
	// 'GET' requests
	app.get('/allUsers', usersController.getAllUsers);
	app.get('/topUsers', usersController.getTopUsers);
	app.get('/getBasicUserInfo', usersController.getBasicUserInfo);

	// 'POST' requests
	app.post('/signin', usersController.signin);
	app.post('/signup', usersController.signup);
	app.post('/closet', usersController.getUserInfo);
	app.post('/editUser', usersController.updateUserInfo);

};