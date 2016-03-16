var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');
var star = require('./starSpanglerDb.js');

// router.get('/', function(req, res, next) {
//    res.sendFile( 'index.html', { root : __dirname + "/../public" } );
// });


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

router.post('/api/login', function(req, res, next){
  star.userFindOne(req.body.emailAddress, function(err, result){
    if(!(result === null) && result.password === req.body.password){
      req.session.user = result;
      res.send(result);
      console.log('logged in');
    }
    else{
      console.log('-1');
    }
  });
});

var requireAuthentication = function(req, res, next){
  if(req.session && req.session.user){
    star.userFindOne(req.session.user.emailAddress, function(err, result){
      if(!err && result){
        req.session.user = result;
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
  star.userCreate(req.body.emailAddress, function(err, result){
    if(result){
      star.userFindOne(req.body.emailAddress, function(err, result){
        res.send(result);
      })
    }
  });
});

router.get('/api/user', function(req, res, next){
  res.send(req.session.user);
});

router.get('/api/users', function(req, res, next){
  star.usersFind(function(err, result){
    if(err){
      res.send(err);
    }
    else{
      res.send(result);
    }
  });
});

router.put('/api/users/:emailAddress/type', function(req, res, next){
  console.log(req.body.userType);
  star.userTypeUpdate(req.params.emailAddress, req.body.userType , function(err, status){
    console.log(status);
  });
});

router.get('/api/documents', function(req, res, next){
  var host = 'www.federalregister.gov';
  var path = '/api/v1/articles?order=relevance'
  var options = {
    host: host,
    path: path,
    method:'GET'
  };

  remoteGet(options, function(status, data){
    res.status(status).send(data);
  });
});

router.post('/api/documents', function(req, res, next){
  star.documentsCreate(req.body.usersList, req.body.documentsList, function(err, results){
    if(err){
      res.send(false);
    }
    else {
      res.send(true);
    }
  });
});

router.get('/api/documents/:emailAddress', function(req, res, next){
  star.documentsFind(req.params.emailAddress, function(err, results){
    if(results){
      var documents = '';
      results.forEach(function(result, i, array){
        var d = result.documentsList.split(',');
        d.forEach(function(r){
          if(!documents.includes(r))
            documents = documents + r + ',';
        })
      });
      documents = documents.substring(0, documents.length - 1);
      var host = 'www.federalregister.gov';
      var path = '/api/v1/articles/' + documents
      var options = {
        host: host,
        path: path,
        method: 'GET'
      };

      remoteGet(options, function(status, data){
        res.status(status).send(data);
      });
    }
    else {

    }
  });
});

router.put('/api/users/:emailAddress/rankedDocuments', function(req, res, next){
  star.documentRate(req.params.emailAddress, req.body.dNumber, req.body.rank, function(err, result){
    if (result) {
      res.send(true);
    }
  });
});

router.put('api/users/:emailAddress/profile', function(req, res, next){
  star.profileUpdate(req.params.emailAddress, req.body, function(err, result){
    
  });
});

module.exports = router;
