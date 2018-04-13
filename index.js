require('isomorphic-fetch');
var express = require('express');
var bodyParser = require('body-parser');
var bluebird = require('bluebird');
var cors = require('cors');
var Dropbox = require('dropbox').Dropbox;

var CLIENT_ID = process.env.CLIENT_ID.trim();
var CLIENT_SECRET = process.env.CLIENT_SECRET.trim();
var PORT = process.env.PORT;


/**
 * Serves the express app
 */
var serve = function () {
  // Create express app
  var app = express();

  app.use(cors());

  // JSON parsing support
  app.use(bodyParser.json());

  // Auth post endpoint
  app.post('/auth', function (req, res) {
    // Require data param to be passed
    if (!req.body.code) {
      res.status(500).send('Missing field');
      return;
    }

    var dbx = new Dropbox({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });
    dbx.getAccessTokenFromCode(req.body.redirect_uri || null, req.body.code)
      .then(function (token) {
        res.status(200).send(token);
      })
      .catch(function(error) {
        res.status(500).send('Unknown error');
        console.log(error, CLIENT_ID, CLIENT_SECRET);
      });
    
  });
  
  app.listen(PORT);

  console.log('App started.');
};

serve();