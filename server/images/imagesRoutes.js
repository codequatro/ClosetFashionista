var imagesController = require('./imagesController.js');

module.exports = function (app) {

	// 'GET' requests
	app.get('/getAllImages', imagesController.getAllImages);
	app.get('/getImageData', imagesController.getImageData);

	// 'POST' requests
	app.post('/postimage', imagesController.postImage);
	app.post('/randomimage', imagesController.randomImage);
	app.post('/removeimage', imagesController.removeImage);
	app.post('/vote', imagesController.vote);

};