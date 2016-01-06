var Q = require('q');
var jwt = require('jwt-simple');
var pg = require('pg');
var connectString = process.env.DATABASE_URL ||
  ( /^win/.test(process.platform) )
    ? 'postgres://postgres:password@localhost:5432/closet'
    : 'postgres://localhost:5432/closet';

var Path = require('path');
var knex = require('knex');
var formidable = require('formidable');
var util = require('util');
var fs   = require('fs-extra');
var AWS = require('aws-sdk');
var bcrypt = require('bcrypt-nodejs');
var cheerio = require('cheerio');
var util = require('./imagesUtil.js');

var fsCopy = Q.nbind(fs.copy, fs);

exports = module.exports = {

	pgConnect: function() {
		var deferred = Q.defer();
    pg.connect(connectString, function (err, client, done){
      if(err){
        deffered.reject(new Error('error connecting to the DB:', err) );
      } else {
      	deferred.resolve({
      		client: client,
      		done: done
      	})
      }
    })
    return deferred.promise;
	},

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

			var clientQuery;
			var done;

			fsCopy( temp_path, new_location + file_name )
				.then(exports.pgConnect)
	    	.then(function(connection) {
	    		done = connection.done;
	    		clientQuery = Q.nbind(connection.client.query, connection.client);

		      return clientQuery(`
		      	SELECT user_id FROM users
		      		 WHERE username = $1`,
		      	[username]
		      );
		    })
      	.then(function(result) {
        	var user_id = result.rows[0].user_id;
          // console.log('select user result', result);
          return clientQuery(`
          	INSERT INTO images (image_name, user_id, type_id)
          		VALUES ($1, $2, $3)`,
          	 [file_name, user_id, clothing_type]
          );
      	})
	      .then(done)
		    .fail(function(err) {
	        console.log('fsCopy err');
        	console.error(err);
        }); //fs copy end
		}) //form.on 'end' end
		
	},

	postUrl: function(req, res, next) {
	}

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
		var voteValue = req.body.voteValue;
		var voteGender = req.body.gender;
		console.log('gender: ', req.body);
		var imageId = req.body.imageId;
		var upvote = 0;
		var downvote = 0;
		var flag = 0;
		if (voteValue === 'upvote') {
			upvote++;
		} else if (voteValue === 'downvote') {
			downvote++;
		} else if (voteValue === 'flag') {
			flag++;
		} else {
			console.log('something terrible happened and the zombies are coming!')
		}
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
		      client.query('INSERT INTO votes (user_id, image_id, upvote, downvote, flag, gender) VALUES ($1, $2, $3, $4, $5, $6)',[userId, imageId, upvote, downvote, flag, voteGender], function(err, result){
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

	getAllImages: function (req, res, next) {
		//create an object to send back to client
		var allImages = {};

		pg.connect(connectString, function (err, client, done) {
		if(err) {
		  console.error('error connecting to the DB:', err);
		}
		else {
	      //get all images
	      client.query('SELECT * FROM images', function(err, result){
	        if(err) {
	       		console.error('error fetching all images: ', err);
	        } else {
	          allImages.pics = result.rows;
	            //grab all of the votes for each user pic
	            client.query('SELECT images.image_name, images.image_id, votes.gender, votes.upvote, votes.downvote, votes.flag FROM images INNER JOIN votes ON images.image_id = votes.image_id', function(err, result){
	                if(err) {
	                	console.error('error fetching votes', err);
	                } else {
						// Calculate votes for each pictures and user credibility			          
						for (var i = 0; i < result.rows.length; i++) {
							if (result.rows[i].upvote === 1) {
								for (var x = 0; x < allImages.pics.length; x++) {
							  		if (!allImages.pics[x].upvotes) allImages.pics[x].upvotes = 0;
							  		if (result.rows[i].image_id === allImages.pics[x].image_id) {
							  			allImages.pics[x].upvotes++;
							  			if (!allImages.pics[x].genderData) allImages.pics[x].genderData = {male: {upvotes: 0, downvotes: 0}, female: {upvotes: 0, downvotes: 0}, other: {upvotes: 0, downvotes: 0}};
									  		if (result.rows[i].gender === 'male') allImages.pics[x].genderData.male.upvotes++
									  		if (result.rows[i].gender === 'female') allImages.pics[x].genderData.female.upvotes++
									  		if (result.rows[i].gender != 'male' && result.rows[i].gender != 'female') allImages.pics[x].genderData.other.upvotes++
							  		}
							  	}
							} else if (result.rows[i].downvote === 1) {
								for (var y = 0; y < allImages.pics.length; y++) {
									if (!allImages.pics[y].downvotes) allImages.pics[y].downvotes = 0;
				  					if (result.rows[i].image_id === allImages.pics[y].image_id) {
				  						allImages.pics[y].downvotes++;
				  						if (!allImages.pics[y].genderData) allImages.pics[y].genderData = {male: {upvotes: 0, downvotes: 0}, female: {upvotes: 0, downvotes: 0}, other: {upvotes: 0, downvotes: 0}};
									  	if (result.rows[i].gender === 'male') allImages.pics[y].genderData.male.downvotes++
									  	if (result.rows[i].gender === 'female') allImages.pics[y].genderData.female.downvotes++
									  	if (result.rows[i].gender != 'male' && result.rows[i].gender != 'female') allImages.pics[y].genderData.other.downvotes++
				  					}
								}
							}
						}
						allImages.pics.sort(function(a, b){
							var upvotesA = a.upvotes;
							var upvotesB = b.upvotes;
					    	if(upvotesA > upvotesB) return -1;
					    	if(upvotesA < upvotesB) return 1;
					    	return 0;
						})
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
		var url = req.body.url;
		var user_id = req.body.user_id;

		if( ! util.isValid(url) ) {
			return next(new Error('Not a valid URL'));
		}

		if( ! util.isSafeUrl(url) ) {
			res.status(403).send({error: 'Malicious site'})
		}
			
		util.getMetaData(url)
			.then(function (data) {
				var link = {
					url: link_url,
					user_id: user_id,
					image_name: data.title,
					description: data.description,
          			source: data.site_name,
          			image: (data.image) ? data.image.url : ''
				};

				res.status(200).json(link);
			})
			.fail(function (err) {
				if (err.message !== 'Stop promise chain') {
          		console.log(err);
          		next(err);
        }
			})

	}

}

// postImage: function(req, res, next) {
// 		var form = new formidable.IncomingForm();

// 		form.parse(req, function(err, fields, files) {

// 		//this is not the right way to go about it. url gets wierd
// 		//NEED TO FIX

// 		res.redirect('back');

// 		//if you want to look at the form getting sent to the server
// 		// res.end(util.inspect({fields: fields, files: files}));
// 		});

// 		var myFields = {};
// 		form.on('field', function(field, value){
// 		myFields[field] = value;
// 		console.log('fields in form.on', myFields);
// 		});

// 		form.on('end', function(fields, files) {
// 			var username = myFields.name;
// 			var clothing_type = myFields.clothingType;
// 			/* Temporary location of our uploaded file */
// 			var temp_path = this.openedFiles[0].path;
// 			/* The file name of the uploaded file */
// 			var file_name = this.openedFiles[0].name;
// 			/* Location where we want to copy the uploaded file */
// 			var new_location = './client/uploads/';

// 			fs.copy(temp_path, new_location + file_name, function(err) {
// 			  if (err) {
// 			    console.error(err);
// 			  }
// 			  else {
// 			    pg.connect(connectString, function (err, client, done){
// 			      if(err){
// 			        console.error('error connecting to the DB:', err);
// 			      }
// 			      // console.log('username', username);
// 			      client.query('SELECT user_id FROM users WHERE username = $1', [username], function(err, result){
// 			        var user_id = result.rows[0].user_id;
// 			        if(err){
// 			          console.error('error on lookup of user id:', err)
// 			        }
// 			        else
// 			        {
// 			          // console.log('select user result', result);
// 			          client.query('INSERT INTO images (image_name, user_id, type_id) VALUES ($1, $2, $3)', [file_name, user_id, clothing_type], function (err, result){
// 			            if(err){
// 			              console.error(err);
// 			            }else {
// 			              done();
// 			            }
// 			          })
// 			        }
// 			      });
// 			    })
// 			  }
// 			}); //fs copy end
// 		}) //form.on 'end' end
		
// 	},
