/*
  - To create local postgres db (first run only):
    - Linux:
      initdb db; sudo chown -R $USER:users /run/postgresql; postgres -D db;
    - Mac:
      initdb db; sudo chown -R $USER:staff /var/run/postgresql; postgres -D db;
    - Windows:
      initdb db
      postgres -D db

  - Then in another Terminal window: 
    - Unix:
      createdb closet; psql closet < server/schema.sql
    - Windows:
      createdb -U postgres closet
      psql -U postgres closet < server/schema.sql

  - For Windows, change the postgres password to 'password'
*/ 

/* 
  - To start postgres server:
    - Linux:
      sudo chown -R $USER:users /run/postgresql; postgres -D db
    - Mac:
      sudo chown -R $USER:staff /var/run/postgresql; postgres -D db;
    - Windows:
      postgres -D db
*/

var express = require('express');
var bodyParser = require('body-parser');

module.exports = app = express();

app.set('port', (process.env.PORT || 4040));

// Set up express formatting.
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Redirect requests for local files to the './client' directory.
app.use(express.static(__dirname + '/client'));

// Initialize routers.
var usersRouter = express.Router();
var imagesRouter = express.Router();

// Configure routers.
require('./server/users/usersRoutes.js')(usersRouter);
require('./server/images/imagesRoutes.js')(imagesRouter);

// Set up route forwarding.
app.use('/users/', usersRouter);
app.use('/images/', imagesRouter);

// Run the server.
app.listen(app.get('port'), function(){
	console.log('Node app is running on port', app.get('port'));
});