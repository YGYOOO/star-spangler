var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');
var users = require('./starSpanglerDb.js');

router.get('/', function(req, res, next) {
   res.sendFile( 'index.html', { root : __dirname + "/../public" } );
});


var remoteGet = function(options, callback){
  var req = https.request(options, function(res){
    var output = [];

    res.on('data', function(chunk){
      output.push(chunk);
    });

    res.on('end', function(){
      var str = output.join('');
      try {
         str = JSON.parse( str );
      } catch(err) {
      }

      callback(res.statusCode, str);
    })
  });

  req.on('error', function(error){
    console.log(error);
    callback(error,{});
  });

  req.end();
};

router.get('/api/document', function(req, res, next){
  var host = 'www.federalregister.gov';
  var type = 'RULE';
  var keyword = 'china';

  // var path = '/articles.json?per_page=20&order=relevance&conditions[term]='
  // + keyword + '&conditions[type]=' + type;

  var path = '/api/v1/agencies'
  var options = {
    host: host,
    path: path,
    method:'GET'
  };

  remoteGet(options, function(status, data){
    res.status(status).send(data);
  })
});

router.post('/api/login', function(req, res, next){
  users.userFindOne(req.body.emailAddress, function(err, result){
    if(err){
      console.log('-1');
    }
    else if(result.password === req.body.password){
      req.session.user = result;
      res.send(result);
      console.log('logged in');
    }
    else{
      console.log('-2');
    }
  });
});

var requireAuthentication = function(req, res, next){
  if(req.session && req.session.user){
    users.userFindOne(req.session.user.emailAddress, function(err, result){
      if(!err && result){
        req.session.user = user;
        next();
      }
      else{
        req.session.user = {};
        res.status(403).send();
      }
    });
  }
  else{
    req.session.user = {};
    res.status(403).send();
  }
}

router.use('/api', requireAuthentication);

router.post('/api/users', function(req, res, next){
  users.userCreate(req.body, function(err, result){
    res.send(result);
  });
});

module.exports = router;
