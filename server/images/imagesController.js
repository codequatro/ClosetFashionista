var Q = require('q');
var jwt = require('jwt-simple');
var pg = require('pg');
var connectString = process.env.DATABASE_URL || 'postgres://localhost:5432/closet';

var Path = require('path');
var knex = require('knex');
var formidable = require('formidable');
var util = require('util');
var fs   = require('fs-extra');
var AWS = require('aws-sdk');
var bcrypt = require('bcrypt-nodejs');
var cheerio = require('cheerio');


exports = module.exports = {

	postImage: function(req, res, next) {
		var form = new formidable.IncomingForm();

		form.parse(req, function(err, fields, files) {

		//this is not the right way to go about it. url gets wierd
		//NEED TO FIX

		res.redirect('back');

		//if you want to look at the form getting sent to the server
		// res.end(util.inspect({fields: fields, files: files}));
		});

		var myFields = {};
		form.on('field', function(field, value){
		myFields[field] = value;
		console.log('fields in form.on', myFields);
		});

		form.on('end', function(fields, files) {
			var username = myFields.name;
			var clothing_type = myFields.clothingType;
			/* Temporary location of our uploaded file */
			var temp_path = this.openedFiles[0].path;
			/* The file name of the uploaded file */
			var file_name = this.openedFiles[0].name;
			/* Location where we want to copy the uploaded file */
			var new_location = './client/uploads/';

			fs.copy(temp_path, new_location + file_name, function(err) {
			  if (err) {
			    console.error(err);
			  }
			  else {
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
			    })
			  }
			}); //fs copy end
		}) //form.on 'end' end
		
	},

	randomImage: function(req, res, next) {
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
			          res.status(200).json({image_name: 'pablo.png', image_id: -1});
			        }
			        else{
			          res.status(200).json({image_name: './uploads/' + image.rows[0].image_name, image_id: image.rows[0].image_id});
			        }
			        done();
			      });
			    }
			  })
			}
		});
	},

	removeImage: function(req, res, next) {
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
	},

	vote: function(req, res, next) {
		var username = req.body.username;
<<<<<<< HEAD
		var hotOrNot = req.body.hotOrNot;
=======
		var voteValue = req.body.voteValue;
>>>>>>> master
		var imageId = req.body.imageId;
		console.log('imageId', imageId);
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
<<<<<<< HEAD
		      client.query('INSERT INTO votes (user_id, image_id, vote) VALUES ($1, $2, $3)',[userId, imageId, hotOrNot], function(err, result){
=======
		      client.query('INSERT INTO votes (user_id, image_id, upvote, downvote, flag) VALUES ($1, $2, $3, $4, $5)',[userId, imageId, upvote, downvote, flag], function(err, result){
>>>>>>> master
		        if(err){
		          console.error('error inserting vote into votes table: ', err);
		        }
		        else{
		          res.status(201).json({result: result.rows});
		          done();
		        }
		      });
		    }
		  })
		}
		});
	},

<<<<<<< HEAD
	
=======
	getAllImages: function (req, res, next) {
		//create an object to send back to client
		var allImages = {};

		pg.connect(connectString, function (err, client, done) {
		if(err){
		  console.error('error connecting to the DB:', err);
		}
		else {
	      //get all images
	      client.query('SELECT * FROM images', function(err, result){
	        if(err){
	          console.error('error fetching all images: ', err);
	        }
	        else{
	          allImages.pics = result.rows;
	            //grab all of the votes for each user pic
	            client.query('SELECT images.image_name, votes.upvote, votes.downvote, votes.flag FROM images INNER JOIN votes ON images.image_id = votes.image_id', function(err, result){
	                if(err){
	                  console.error('error fetching votes', err);
	                }
	                else{
	                  allImages.votes = result.rows;
	                  res.status(200).json(allImages);
	                  done();
	                }
	            });
	          }
	      })
		}
		}); //pg.connect
	},

	getImageData: function (req, res, next) {
		
	}
>>>>>>> master

}