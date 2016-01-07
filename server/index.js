var express = require('express');
var Path = require('path');
var routes = express.Router();
var pg = require('pg');
var connectString = process.env.DATABASE_URL || 'postgres://localhost:5432/closet';
var knex = require('knex');
var jwt = require('jwt-simple');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var util = require('util');
var fs   = require('fs-extra');
var AWS = require('aws-sdk');

//
//route to your index.html
//
var assetFolder = Path.resolve(__dirname, '../');
routes.use(express.static(assetFolder));

// User route SIGNIN
// need better error handling for bad username
routes.post('/signin', function (req, res){
  var attemptedUsername = req.body.username;
  var attemptedPassword = req.body.password;
  pg.connect(connectString, function (err, client, done){
    if(err){
      console.error(err);
    }
    client.query('SELECT username, password FROM users WHERE username = $1', [attemptedUsername], function (err, result){
      if(result.rows.length === 0){
        res.status(401).json({answer: 'Username/Password Incorrect!'});
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
          res.status(401).json({answer: 'Username/Password Incorrect!'})
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
    client.query('SELECT * FROM users WHERE username = $1', [username], function (err, result) {
      if(result.rows.length === 0){
         client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password], function (err, result){
          if(err){
            console.log('database error on signup')
            console.error(err);
          } else {
            res.status(201).json({username: username}) // removed token as was undefined for signup
            done();   
          }
        })
       
      }else if(result.rows[0].username === username){
         console.log('result', result);
         res.status(401).json({answer: 'Username already exists!'}); 
      }
    });
  })
});

routes.post('/postimage', function (req, res){

  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    //this is not the right way to go about it. url gets weird
    //NEED TO FIX

    res.redirect('#/closet');

    //if you want to look at the form getting sent to the server
    //res.end(util.inspect({fields: fields, files: files}));
  });

  var myFields = {};
  form.on('field', function(field, value){
    myFields[field] = value;
  });

  form.on('end', function(fields, files) {
    var username = myFields.name;
    var clothing_type = myFields.clothingType;
    /* Temporary location of our uploaded file */
    if(myFields.image){
      var decodedImage = new Buffer(myFields.image
    .replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
      //var decodedImage = new Buffer(myFields.image, 'base64').toString('binary');
      /* The file name of the uploaded file */
      var file_name = "cam" + Math.floor(Math.random()*9999999999) + ".jpeg";
      var temp_path = "";
    }else{
      var temp_path = this.openedFiles[0].path;
      /* The file name of the uploaded file */
      var file_name = this.openedFiles[0].name;
      console.log(file_name);
      var getExt = /(?:\.([^.]+))?$/;
      var ext = getExt.exec(file_name)[1]; 
      file_name = file_name.replace(ext,""); 
      file_name = file_name + Math.floor(Math.random()*9999999999) + "." + ext;
      //console.log("name", file_name, "rand", Math.floor(Math.random()*9999999999), "ext", ext);
    }

    /* Location where we want to copy the uploaded file */
    var new_location = './client/uploads/';

    fs.copy(temp_path, new_location + file_name, function(err) {
      if (err) {
        fs.writeFile(new_location + file_name, decodedImage, function(err) {
          if (err) console.error(err);
          else {
            console.log(file_name);
            saveToDB();
          }
        });
      }else{
        saveToDB();
      }
    });

    function saveToDB(){
      pg.connect(connectString, function (err, client, done){
        if(err){
          console.error('error connecting to the DB:', err);
        }
        // console.log('username', username);
        client.query('SELECT user_id FROM users WHERE username = $1', [username], function(err, result){
          var user_id = result.rows[0].user_id;
          if(err){
            console.error('error on lookup of user id:', err)
          }
          else
          {
            // console.log('select user result', result);
            client.query('INSERT INTO images (image_name, user_id, type_id) VALUES ($1, $2, $3)', [file_name, user_id, clothing_type], function (err, result){
              if(err){
                console.error(err);
              }else {
                done();
              }
            })
          }
        });
      });
    }

  }); //form.on 'end' end
});

routes.post('/randomimage', function (req, res){
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
          var userId = result.rows[0].user_id;
          client.query('SELECT image_name, image_id FROM images WHERE images.user_id <> $1 AND images.image_id NOT IN (SELECT image_id FROM votes WHERE user_id = $1) ORDER BY RANDOM() LIMIT 1' ,[userId], function(err, image){
            if(image.rows.length === 0){
              res.status(200).json({image_name: 'client/img/emptyCloset.jpg', image_id: -1});
            }
            else{
              res.status(200).json({image_name: 'client/uploads/' + image.rows[0].image_name, image_id: image.rows[0].image_id});
            }
            done();
          });
        }
      })
    }
  });
});

//get all the user's photos
routes.post('/closet', function (req, res){
  var username = req.body.username;
  //create an object to send back to client
  var closetItems = {};

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
          var userId = result.rows[0].user_id;
          //get all of the current users images
          client.query('SELECT image_name, image_id, type_id FROM images i, users u WHERE i.user_id = u.user_id and u.user_id = $1', [userId], function(err, result){
            if(err){
              console.error('error fetching closet images: ', err);
            }
            else{
              console.log("result", result);
              closetItems.pics = result.rows;

                //grab all of the votes for each user pic
                client.query('SELECT images.image_name, votes.rating FROM images INNER JOIN votes ON images.image_id = votes.image_id and images.user_id=$1', [userId], function(err, result){
                    if(err){
                      console.error('error fetching votes', err);
                    }
                    else{
                      closetItems.votes = result.rows;
                      res.status(200).json(closetItems);
                      done();
                    }
                });
              }
          });//second client query
        }
      });//first client query
    }
  }); //pg.connect
});

//remove image from closet
routes.post('/removeimage', function (req, res){
  var imageId = req.body.imageId;
  var imageName = req.body.imageName;
  pg.connect(connectString, function (err, client, done) {
    if(err){
      console.error('error connecting to the DB:', err);
    }
    else {
      client.query('DELETE FROM votes WHERE image_id = $1', [imageId], function(err, result){
        if(err){
          console.error('error deleting image from closet', err)
        }
        else {
          client.query('DELETE FROM images WHERE image_id = $1', [imageId], function(err, result){
            if(err){
              console.error('error deleting image from closet', err)
            }
            else {
              fs.unlink('./client/uploads/' + imageName, function(err){
                if(err){
                  console.error(err);
                }
                else{
                  res.status(200).json({result: result.rows});
                  done();
                }
              })
            }
          });
        }
      });
    }
  }); 
})

routes.post('/vote', function (req, res){
  var username = req.body.username;
  var rating = req.body.rating;
  var imageId = req.body.imageId;
  var message = req.body.message;
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
          var userId = result.rows[0].user_id
          client.query('INSERT INTO votes (user_id, image_id, rating, message) VALUES ($1, $2, $3, $4)',[userId, imageId, rating, message], function(err, result){
            if(err){
              console.error('error inserting vote into votes table: ', err);
            }
            else{
              console.log('inserted');
              res.status(201).json({result: result.rows});
              done();
            }
          });
        }
      })
    }
  });
});

/*************************AMAZON STORAGE FOR IMAGES******************************************/
routes.post('/s3test', function (req, res){
  console.log('s3 test');
  AWS.config.region = 'us-east-1';

  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
  });

  form.on('end', function(fields, files) {
    /* Temporary location of our uploaded file */
    var temp_path = this.openedFiles[0].path;
    /* The file name of the uploaded file */
    var file_name = this.openedFiles[0].name;
    // /* The type of file*/
    // var file_type = this.openedFiles[0].type;

    console.log('file anme', file_name);

    fs.readFile(temp_path, function(err, data) {
      if (err) {
        console.error(err);
      }
      else {
        var bucket = new AWS.S3({params: {Bucket: 'cqphotos'}});
        bucket.upload({Key: file_name, Body: data}, function (err, data){
          if(err){
            console.log(err);
          }
          else{
            res.status(201).end();
          }
        });
      }
    }); //fs copy end
  }); //form.on 'end' end
});


/*************************AMAZON STORAGE FOR IMAGES******************************************/


if(process.env.NODE_ENV !== 'test') {
  //
  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST.
  //
  routes.get('/*', function(req, res){
    res.sendFile( assetFolder + '/client/index.html' )
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
// pg.connect(process.env.DATABASE_URL || 'postgres://localhost:5432/closet', function(err, client){
//   if (err) throw err;
//   console.log('Connected to closet!');

// });
