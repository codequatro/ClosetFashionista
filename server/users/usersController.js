var Q = require('q');
var jwt = require('jwt-simple');
var pg = require('pg');

var connectString = process.env.DATABASE_URL ||
  ( /^win/.test(process.platform) )
    ? 'postgres://postgres:password@localhost:5432/closet'
    : 'postgres://localhost:5432/closet';

// Object.prototype.forEach = function(fn) {
// 	for (var p in this) {
// 		fn(this[p], p, this);
// 	}
// };

function pgConnect() {
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
};

exports = module.exports = {

	signin: function(req, res, next) {
		var attemptedUsername = req.body.username;
		var attemptedPassword = req.body.password;

		var clientQuery;
		var done;

		pgConnect()
			.then(function(connection) {
    		done = connection.done;
    		clientQuery = Q.nbind(connection.client.query, connection.client);

    		return clientQuery(`
					SELECT username,  password, user_id,
								 firstname, lastname, gender,  credibilityScore
						FROM users
							WHERE username = $1`, [attemptedUsername]
    		);
    	})
    	.then(function(result) {
    		if(result.rows.length === 0){
			    res.status(401).json({ answer: 'Invalid Username' });
			    throw new Error('Stop promise chain');
			  }
		    var username         = result.rows[0].username;
		    var password         = result.rows[0].password;
		    var user_id          = result.rows[0].user_id;
		    var firstname        = result.rows[0].firstname;
		    var lastname         = result.rows[0].lastname;
		    var gender           = result.rows[0].gender;
		    var credibilityScore = result.rows[0].credibilityScore;

		    if(attemptedPassword !== password) {
		      res.status(401).json({ answer: 'Invalid Password' });
			    throw new Error('Stop promise chain');
		    }
	      var token = jwt.encode(password, 'secret');
	      res.status(200).json({
	      	token: token,
	      	username: username,
	      	userID: user_id,
	      	firstname: firstname,
				  lastname: lastname,
				  gender: gender,
				  credibilityScore: credibilityScore
	      });
    	})
    	.then(done)
    	.fail(function(err) {
    		if (err.message === 'Stop promise chain') {
					console.log('Failed to signin %s', attemptedUsername);
    		} else {
    			console.log(err);
    			next(err);
    		}
    		done();
    	})
		// pg.connect(connectString, function (err, client, done) {
		// 	if(err) {
		// 	  console.error(err);
		// 	} else {
		// 		client.query(`
		// 			SELECT username, password, user_id, firstname, lastname, gender, credibilityScore
		// 				FROM users
		// 					WHERE username = $1`, [attemptedUsername],
		// 		function (err, result){
		// 		  if(result.rows.length === 0){
		// 		    res.status(401).json({ answer: 'Invalid Username' });
		// 		  } else {
		// 		    var username = result.rows[0].username;
		// 		    var password = result.rows[0].password;
		// 		    var user_id = result.rows[0].user_id;
		// 		    var firstname = result.rows[0].firstname;
		// 		    var lastname = result.rows[0].lastname;
		// 		    var gender = result.rows[0].gender;
		// 		    var credibilityScore = result.rows[0].credibilityScore;
		// 		    if(attemptedPassword === password) {
		// 		      var token = jwt.encode(result.rows[0].password, 'secret');
		// 		      res.status(200).json({
		// 		      	token: token,
		// 		      	username: username,
		// 		      	userID: user_id,
		// 		      	firstname: firstname,
		// 					  lastname: lastname,
		// 					  gender: gender,
		// 					  credibilityScore: credibilityScore,
		// 		      });
		// 		    } else {
		// 		      res.status(401).json({ answer: 'Invalid Password' });
		// 		    }
		// 		  }
		// 		})
		// 	}
		// })
	},

	signup: function(req, res, next) {
		var username = req.body.username;
		var password = req.body.password;
		var firstname = req.body.firstname;
		var lastname = req.body.lastname;
		var gender = req.body.gender;
		pg.connect(connectString, function (err, client, done) {
			if(err) {
				console.error(err);
			} else {
				client.query('INSERT INTO users (username, password, firstname, lastname, gender) VALUES ($1, $2, $3, $4, $5)', [username, password, firstname, lastname, gender], function (err, result){
				  if(err) {
				    console.log('not cool man. database error on signup: ', err)
				  } else {
				  	console.log('result: ', result)
				    res.status(201).json({ username: username }) // removed token as was undefined for signup
				    done();
				  }
				})	
			}
		}) // pg.connect end
	},

	updateUserInfo: function(req, res, next) {
		var userID = req.body.userID;
		var username = req.body.username;
		var firstname = req.body.firstname;
		var lastname = req.body.lastname;
		pg.connect(connectString, function (err, client, done) {
			client.query('UPDATE users SET username = $2, firstname = $3, lastname = $4, WHERE user_id = $1', [userID, username, firstname, lastname])
			client.query('SELECT username, firstname, lastname FROM users WHERE user_id = $1', [userID], function (err, result){
				if(err) {
			    	console.error('error on lookup of user_id: ', err)
			    } else {
					var userInfo = {
						username: username,
						firstname: firstname,
						lastname: lastname
					};
					res.status(200).json(userInfo);
					done();
			    }
			})
		}) // pg.connect end
	},

	getUserInfo: function(req, res, next) {
		var username = req.body.username;

		pg.connect(connectString, function (err, client, done) {
		if(err) {
			console.error('error connecting to the DB:', err);
		} else {
			client.query('SELECT * FROM users WHERE username = $1', [username], function(err, result){
		    if(err) {
		    	console.error('error on lookup of user_id: ', err)
		    } else {
				var userId = result.rows[0].user_id;
				//create a 'userInfo' object to send back to client
				var userInfo = {};
				userInfo.userID = result.rows[0].user_id;
				userInfo.username = result.rows[0].username;
				userInfo.firstname = result.rows[0].firstname;
				userInfo.lastname = result.rows[0].lastname;
				userInfo.gender = result.rows[0].gender;
				//get all of the current users images
				client.query('SELECT image_name, image_id, type_id, source, image, link_url FROM images i, users u WHERE i.user_id = u.user_id and u.user_id = $1', [userId], function(err, result){
				if(err) {
					console.error('error fetching closet images: ', err);
				} else {
					userInfo.pics = result.rows;
				    //grab all of the votes for each user pic
				    client.query('SELECT images.image_name, images.image_id, votes.gender, votes.upvote, votes.downvote FROM images INNER JOIN votes ON images.image_id = votes.image_id and images.user_id=$1', [userId], function(err, result){
				        if(err) {
				        	console.error('error fetching votes: ', err);
				    	} else {
							userInfo.votes = result.rows;
							userInfo.userCredibility = 0;
							// Calculate votes for each pictures and user credibility			          
							for (var i = 0; i < result.rows.length; i++) {
								if (result.rows[i].upvote === 1) {
									userInfo.userCredibility++;
									for (var x = 0; x < userInfo.pics.length; x++) {
								  		if (!userInfo.pics[x].upvotes) userInfo.pics[x].upvotes = 0;
								  		if (result.rows[i].image_id === userInfo.pics[x].image_id) {
								  			userInfo.pics[x].upvotes++;
								  			if (!userInfo.pics[x].genderData) userInfo.pics[x].genderData = {male: {upvotes: 0, downvotes: 0}, female: {upvotes: 0, downvotes: 0}, other: {upvotes: 0, downvotes: 0}};
									  		if (result.rows[i].gender === 'male') userInfo.pics[x].genderData.male.upvotes++
									  		if (result.rows[i].gender === 'female') userInfo.pics[x].genderData.female.upvotes++
									  		if (result.rows[i].gender != 'male' && result.rows[i].gender != 'female') userInfo.pics[x].genderData.other.upvotes++
								  		}
								  	}
								} else if (result.rows[i].downvote === 1) {
									userInfo.userCredibility--;
									for (var y = 0; y < userInfo.pics.length; y++) {
										if (!userInfo.pics[y].downvotes) userInfo.pics[y].downvotes = 0;
					  					if (result.rows[i].image_id === userInfo.pics[y].image_id) {
								  			userInfo.pics[y].downvotes++;
								  			if (!userInfo.pics[y].genderData) userInfo.pics[y].genderData = {male: {upvotes: 0, downvotes: 0}, female: {upvotes: 0, downvotes: 0}, other: {upvotes: 0, downvotes: 0}};
									  		if (result.rows[i].gender === 'male') userInfo.pics[y].genderData.male.downvotes++
									  		if (result.rows[i].gender === 'female') userInfo.pics[y].genderData.female.downvotes++
									  		if (result.rows[i].gender != 'male' && result.rows[i].gender != 'female') userInfo.pics[y].genderData.other.downvotes++
								  		}
									}
								}
							}

							// Update User Credibility Score in Database for Efficiency When Grabbing Score Later
							client.query('UPDATE users SET credibilityScore = $2 WHERE username = $1', [username, userInfo.userCredibility])

							res.status(200).json(userInfo);
							done();
				        }
				    });
				  }
				}) // end of user images query
		    }
		  }) //end of userInfo query
		}
		}) // pg.connect end
	},

	getBasicUserInfo: function(req, res, next) {
		var username = req.body.username;
		pg.connect(connectString, function (err, client, done) {
		if(err) {
			console.error('error connecting to the DB:', err);
		} else {
			client.query('SELECT * FROM users WHERE username = $1', [username], function(err, result){
		    if(err) {
		    	console.error('error on lookup of user_id: ', err)
		    } else {
				var userId = result.rows[0].user_id;
				//create a 'userInfo' object to send back to client
				var userInfo = {};
				userInfo.userID = result.rows[0].user_id;
				userInfo.username = result.rows[0].username;
				userInfo.firstname = result.rows[0].firstname;
				userInfo.lastname = result.rows[0].lastname;
				userInfo.gender = result.rows[0].gender;
				res.status(200).json(userInfo);
				done();
		    }
		  }) //end of userInfo query
		}
		}) // pg.connect end
	},

	getAllUsers: function(req, res, next) {
		pg.connect(connectString, function (err, client, done) {
			client.query('SELECT user_id, username, firstname, lastname, gender, credibilityScore FROM users', [], function (err, result){
				if(err) {
			    	console.error('error on lookup of all users: ', err)
			    } else {
					allUsers = result.rows;
					res.status(200).json(allUsers);
					done();
			    }
			})	
		}) // pg.connect end
	},

	getTopUsers: function(req, res, next) {
		pg.connect(connectString, function (err, client, done) {
			client.query('SELECT user_id, username, firstname, lastname, gender, credibilityScore FROM users', [], function (err, result){
				if(err) {
			    	console.error('error on lookup of top users: ', err)
			    } else {
					topUsers = result.rows;
					// sort users by highest credibility score
					topUsers.sort(function(a, b){
						var scoreA = a.credibilityscore;
						var scoreB = b.credibilityscore;
					    if(scoreA > scoreB) return -1;
					    if(scoreA < scoreB) return 1;
					    return 0;
					})
					res.status(200).json(topUsers);
					done();
			    }
			})	
		}) // pg.connect end
	},

	addFollower: function(req, res, next) {
		var follower = req.body.follower;
		var following = req.body.following;

    // Example for 'following':
		//   user_id: 1,
	  //   username: 'Tarly',
	  //   firstname: 'Tarly',
	  //   lastname: 'Fass',
	  //   gender: 'male',
	  //   credibilityscore: null

		var clientQuery;
		var done;

		pgConnect()
			.then(function(connection) {
    		done = connection.done;
    		clientQuery = Q.nbind(connection.client.query, connection.client);

    		return clientQuery(`
    			SELECT follower_id FROM following
    				WHERE following_id = $1`,
    			[following.user_id]
    		);
    	})
    	.then(function(result) {
    		var alreadyExists = ( result.rowCount !== 0 );
    		if (alreadyExists) {
    			throw new Error('Stop promise chain');
    		}
    		return clientQuery(`
    			INSERT INTO following (follower_id, following_id)
    				VALUES ($1, $2)`,
    			[follower.userID, following.user_id]
    		);
    	})
    	.then(function(result) {
				console.log('%s is now following %s', follower.username, following.username);

    		return res.json({
    			follower: {
    				user_id: follower.user_id,
    				username: follower.username,
    				firstname: follower.firstname,
    				lastname: follower.lastname,
    				gender: follower.gender,
    				credibilityscore: follower.credibilityscore
    			},
    			following: {
    				user_id: following.user_id,
    				username: following.username,
    				firstname: following.firstname,
    				lastname: following.lastname,
    				gender: following.gender,
    				credibilityscore: following.credibilityscore
    			}
    		});
    	})
    	.then(done)
    	.fail(function(err) {
    		if (err.message === 'Stop promise chain') {
					console.log(
						'%s is already following %s',
						follower.username, following.username
					);
    			res.json({
	    			follower: {
	    				user_id: follower.user_id,
	    				username: follower.username,
	    				firstname: follower.firstname,
	    				lastname: follower.lastname,
	    				gender: follower.gender,
	    				credibilityscore: follower.credibilityscore
	    			},
	    			following: {
	    				user_id: following.user_id,
	    				username: following.username,
	    				firstname: following.firstname,
	    				lastname: following.lastname,
	    				gender: following.gender,
	    				credibilityscore: following.credibilityscore
	    			}
	    		});
    		} else {
    			console.log(err);
    			next(err);
    		}
    		done();
    	})
	}

}