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

      var user = collection.findOne({username: { $in: [username] }});

      if(user) {
        res.send({status: "401", mesage: "duplicate username"});
        return;
      }
      var userForInsert = {
        username: username,
        password: password
      }

      collection.insert(userForInsert, function(err, res) {
        if(err) {
          console.log('error');
        } else {
          console.log('inserted');
        }
      })
    }
  });
});

app.get('/', function (req, res) {
  res.send('onit user service');
});

var server = app.listen(5050, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('onit user app listening at http://%s:%s', host, port);
});
