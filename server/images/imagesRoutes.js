var imagesController = require('./imagesController.js');

module.exports = function (app) {

  app.post('/postimage', imagesController.postImage);
  app.post('/randomimage', imagesController.randomImage);
  app.post('/removeimage', imagesController.removeImage);
  app.post('/vote', imagesController.vote);

};