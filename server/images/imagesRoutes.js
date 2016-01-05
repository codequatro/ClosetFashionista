var imagesController = require('./imagesController.js');

module.exports = function (app) {

  app.post('/postimage', imagesController.postImage);

};