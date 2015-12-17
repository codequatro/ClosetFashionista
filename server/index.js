var express = require('express');
var Path = require('path');
var routes = express.Router();
var pg = require('pg');
var connectString = 'postgres://localhost:5432/closet';

//
//route to your index.html
//
var assetFolder = Path.resolve(__dirname, '../client/');
routes.use(express.static(assetFolder));

//
// Example endpoint (also tested in test/server/index_test.js)
//
routes.get('/api/tags-example', function(req, res) {
  res.send(['node', 'express', 'angular'])
});

// User Route
// Still need to add session and check username if exists
routes.post('/signup', function (req, res){
  var username = req.body.username;
  var password = req.body.password;
  pg.connect(connectString, function (err, client, done){
    if(err){
      console.error(err);
    }
    client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password], function (err, result){
      if(err){
        console.error(err);
      }else {
        done();
        res.sendStatus(201);
      }
    })
  })
})


// Sign In - if username exists and password matches give session - select to looks for user and password
// GET request for all images
// POST request to upload an image
// GET request for a random image
// POST request for voting

if(process.env.NODE_ENV !== 'test') {
  //
  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST.
  //
  routes.get('/*', function(req, res){
    res.sendFile( assetFolder + '/index.html' )
  })

  //
  // We're in development or production mode;
  // create and run a real server.
  //
  var app = express();

  // Parse incoming request bodies as JSON
  app.use( require('body-parser').json() );

  // Mount our main router
  app.use('/', routes);

  // Start the server!
  var port = process.env.PORT || 4040;
  app.listen(port);
  console.log("Listening on port", port);
} else {
  // We're in test mode; make this file importable instead.
  module.exports = routes;
}

// pg connection
pg.connect(process.env.DATABSAE_URL || 'postgres://localhost:5432/closet', function(err, client){
  if (err) throw err;
  console.log('Connected to closet!');

});
