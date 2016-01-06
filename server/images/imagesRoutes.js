var imagesController = require('./imagesController.js');

module.exports = function (app) {

	// 'GET' requests
	app.get('/getAllImages', imagesController.getAllImages);

	// 'POST' requests
	app.post('/postimage', imagesController.postImage);
	app.post('/randomimage', imagesController.randomImage);
	app.post('/removeimage', imagesController.removeImage);
	app.post('/getImageData', imagesController.collectUrlData);
	app.post('/vote', imagesController.vote);

};