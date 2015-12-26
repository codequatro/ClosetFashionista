var express = require('express');
var Path = require('path');
var routes = express.Router();
var pg = require('pg');
var connectString = 'postgres://localhost:5432/closet';
var knex = require('knex');
var jwt = require('jwt-simple');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var util = require('util');
var fs   = require('fs-extra');
//
//route to your index.html
//
var assetFolder = Path.resolve(__dirname, '../client/');
routes.use(express.static(assetFolder));

// User route SIGNIN
// need better error handling for bad username
routes.post('/signin', function (req, res){
  console.log('singin index.js', req.body.username, req.body.password)
  var attemptedUsername = req.body.username;
  var attemptedPassword = req.body.password;
  pg.connect(connectString, function (err, client, done){
    if(err){
      console.error(err);
    }
    client.query('SELECT username, password FROM users WHERE username = $1', [attemptedUsername], function (err, result){
      console.log('result', result);
      if(result.rows.length === 0){
        res.status(401).json({answer: 'invalid username'});
      }
      else
      {
        var username = result.rows[0].username;
        var password = result.rows[0].password
        if(attemptedPassword === password){
          var token = jwt.encode(result.rows[0].password, 'secret')
          res.status(200).json({token: token, username: username})
          }
        else {
          res.status(401).json({answer: 'invalid password'})
          }
      }
    })
  })
})


/*User route SIGNUP*/
routes.post('/signup', function (req, res){
  var username = req.body.username;
  var password = req.body.password;
  pg.connect(connectString, function (err, client, done){
    if(err){
      console.error(err);
    }
    client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password], function (err, result){
      if(err){
        console.log('database error on signup')
        console.error(err);
      } else {
        res.status(201).json({username: username}) // removed token as was undefined for signup
        done();
      }
    })
  })
});

routes.post('/postimage', function (req, res){

  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {

    //this is not the right way to go about it. url gets wierd
    //NEED TO FIX

    res.redirect('#/closet');

    //if you want to look at the form getting sent to the server
    // res.end(util.inspect({fields: fields, files: files}));
  });

  console.log('made it to 1');
  form.on('field', function(name, value) {
    /*Get username to associate username with picture*/
    console.log('value from form.on field', value);
    var username = value;
    console.log('made it to 2');

    form.on('end', function(fields, files) {
      console.log('made it to 3');
      /* Temporary location of our uploaded file */
      var temp_path = this.openedFiles[0].path;
      /* The file name of the uploaded file */
      var file_name = this.openedFiles[0].name;
      /* Location where we want to copy the uploaded file */
      var new_location = '../uploads/';

      fs.copy(temp_path, new_location + file_name, function(err) {
        if (err) {
          console.error(err);
        }
        else {
          pg.connect(connectString, function (err, client, done){
            if(err){
              console.error('error connecting to the DB:', err);
            }
            console.log('username', username);
            client.query('SELECT user_id FROM users WHERE username = $1', [username], function(err, result){
              var user_id = result.rows[0].user_id;
              if(err){
                console.error('error on lookup of user id:', err)
              }
              else
              {
                console.log('select user result', result);
                client.query('INSERT INTO images (image_name, user_id) VALUES ($1, $2)', [file_name, user_id], function (err, result){
                  if(err){
                    console.error(err);
                  }else {
                    done();
                    console.log('wrote to database', result);
                  }
                })
              }
            });
          })
        }
      }); //fs copy end
    }); //form.on 'end' end
  }); //form.on 'field'
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
      });
    }
  });
});

routes.post('/closet', function (req, res){
  var username = req.body.username;
  pg.connect(connectString, function (err, client, done) {
    if(err){
      console.error('error connecting to the DB:', err);
    }
    else {
      client.query('SELECT user_id FROM users WHERE username = $1', [username], function(err, result){
        if(err){
          console.error('error on lookup of user_id', err)
        }
        else {
          var user_id = result.rows[0].user_id
          client.query('SELECT image_name FROM images i, users u where i.user_id = u.user_id and u.user_id = $1', [user_id], function(err, result){
            if(err){
              console.error('error fetching closet images: ', err);
            }
            else{
              res.status(200).json({images: result.rows});
              done();
            }
          });
        }
      })
    }
  });
});


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
