var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser')

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/onit';


var app = express();
app.use(bodyParser.json());

app.post ('/create', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    }
    else {
      var collection = db.collection('users');
      var username = req.body.username;
      var password = req.body.password;
      collection.findOne({username: { $in: [username] }},
      function(err, item) {
        if(item) {
          res.send({status: "401", mesage: "duplicate username"});
          return;
        }
        else {
          var userForInsert = {
            username: username,
            password: password
          }
          collection.insert(userForInsert, function(err, result) {
            if(err) {
              console.log('error');
              res.send({status: "500", mesage: "error ocurred"});
            } else {
              console.log('user inserted');
              res.send({status: "200", mesage: "user created"});
            }
          });
        }
      });
    }
  });
});

app.post('/auth', function(req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    }
    else {
      var collection = db.collection('users');
      var username = req.body.username;
      var password = req.body.password;
      collection.findOne({username: { $in: [username] }, password: { $in: [password] }},
      function(err, item) {
          if(err) {
          res.send({status:"error",message:"db error",token:null})
        }
        if(item) {
          res.send({status:"ok",token:username + "99"})
        }
        else {
          res.send({status:"failed",token:null})
        }
      });
    }
  });
});

app.verifyToken = function(username, token) {
  return token === username + "99"
}

app.get('/', function (req, res) {
  res.send('onit user service');
});

var server = app.listen(5050, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('onit user app listening at http://%s:%s', host, port);
});
