var express = require('express');
var Path = require('path');
var routes = express.Router();
var pg = require('pg');
var connectString = 'postgres://localhost:5432/closet';
<<<<<<< c85740147f8132dcaf80028b9948c784b9fa60ed
var knex = require('knex');
var jwt = require('jwt-simple');
=======
var bodyParser = require('body-parser');
// var multiparty = require('multiparty');
var formidable = require('formidable');
// var busboy = require('connect-busboy');
// var multer  = require('multer');
var util = require('util');
var fs   = require('fs-extra')

// var IMAGE_TYPES = ['image/jpeg', 'image/png']; 
>>>>>>> building out routes for images

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


// User route SIGNIN
// need better error handling for bad username
routes.post('/signin', function (req, res){
  var attemptedUsername = req.body.username;
  var attemptedPassword = req.body.password;
  // console.log('SEE THIS', attemptedPassword, attemptedUsername);
  pg.connect(connectString, function (err, client, done){ 
    if(err){
      console.error(err);
    }
    client.query('SELECT username, password FROM users WHERE username = $1', [attemptedUsername], function (err, result){
      var username = result.rows[0].username;
      if(!username){
        res.status(401).json({answer: 'invalid username'})
      }else {
        var password = result.rows[0].password
        if(attemptedPassword === password){ 
        var token = jwt.encode(result.rows[0].password, 'secret')
        res.status(200).json({token: token})
        }else {
          res.status(401).json({answer: 'invalid password'})
          }
        }
    })
  })
})
      

// User route SIGNUP
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
});

routes.post('/postimage', function (req, res){
  
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    res.end(util.inspect({fields: fields, files: files}));
  });

  form.on('end', function(fields, files) {
    /* Temporary location of our uploaded file */
    var temp_path = this.openedFiles[0].path;
    /* The file name of the uploaded file */
    var file_name = this.openedFiles[0].name;
    /* Location where we want to copy the uploaded file */
    var new_location = 'uploads/';

    fs.copy(temp_path, new_location + file_name, function(err) {  
      if (err) {
        console.error(err);
      } 
      else {
        pg.connect(connectString, function (err, client, done){
          if(err){
            console.error('error connecting to the DB:', err);
          }
          console.log('file_name', file_name);
          client.query('INSERT INTO images (image_name) VALUES ($1)', [file_name], function (err, result){
            if(err){
              console.error(err);
            }else {
              done();
              console.log('wrote to database', result);
            }
          })
        })
      }
    });
  });
});

routes.get('/randomimage', function (req, res){
  pg.connect(connectString, function (err, client, done) {
    if(err){
      console.error('error connecting to the DB:', err);
    }
    else {
      client.query('SELECT image_name FROM images ORDER BY RANDOM() LIMIT 1', function(err, image){
        res.json(200, {image_name: image.rows[0].image_name});
        done();
      })
    }
  })
})

routes.get('/closet', function (req, res){
  var username = req.body.username;
  pg.connect(connectString, function (err, client, done) {
    if(err){
      console.error('error connecting to the DB:', err);
    }
    else {
      client.query('SELECT image_name FROM images i, users u where i.image_id = u.image_id', function(err, images){
        res.status(200).json({images: image.rows.image_name});
        done();
      })
    }
  })
})


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
  app.use( bodyParser.json() );

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
pg.connect(process.env.DATABASE_URL || 'postgres://localhost:5432/closet', function(err, client){
  if (err) throw err;
  console.log('Connected to closet!');

});
