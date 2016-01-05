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

		res.redirect('#/closet');

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
		
	}




}