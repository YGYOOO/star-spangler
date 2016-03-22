var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');
var star = require('./starSpanglerDb.js');
var PHOTO_DIRECTORY = __dirname + '/../public/avatars';
var multer  = require('multer')({dest: PHOTO_DIRECTORY});
var fs = require('fs');


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
    }
    else{
      console.log('-1');
    }
  });
});

router.get('/api/logout', function(req, res, next){
  req.session.reset();
  res.send(true);
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
      });
    }
    else {
      res.send(false);
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

router.get('/api/documents/:url', function(req, res, next){
  var host = 'www.federalregister.gov';
  var path = '/api/v1/articles?' + req.params.url;
  var options = {
    host: host,
    path: path,
    method:'GET'
  };

  remoteGet(options, function(status, data){
    res.status(status).send(data);
  });
});


router.post('/api/documentsList', function(req, res, next){
  star.documentsListCreate(req.body.usersList, req.body.documentsList, function(err, results){
    if(err){
      res.send(false);
    }
    else {
      res.send(true);
    }
  });
});

router.get('/api/documentsList', function(req, res, next){
  star.documentsListFind(function(err, results){
    if(err){
      res.send(err);
    }
    else {
      res.send(results);
    }
  });
});

router.put('/api/documentsList/:listId', function(req, res, next){
  star.documentsListUpdate(req.params.listId, req.body, function(err, result){
    if(err){
      res.send(err);
    }
    else {
      res.send(result);
    }
  });
});

router.delete('/api/documentsList/:listId', function(req, res, next){
  star.documentsListDelete(req.params.listId, function(err, result){
    if(!err){
      res.send(result);
    }
  });
});

router.get('/api/users/:emailAddress/documents', function(req, res, next){
  star.documentsFind(req.params.emailAddress, function(err, results){
    var documents = '';
    if(results){
      results.forEach(function(result, i, array){
        var d = result.documentsList.split(',');
        d.forEach(function(r){
          if(!documents.includes(r))
          {
            documents = documents + r + ',';
          }
        })
      });
      if(documents){
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

router.put('/api/users/:emailAddress/profile', function(req, res, next){
  star.profileUpdate(req.params.emailAddress, req.body, function(err, result){
    res.send(result.toString());
  });
});

router.post('/api/users/:emailAddress/avatar', multer.single('avatar'), function(req, res, next){
  var avatar = {
    tags : JSON.parse( req.body.tags ),
    imageId : req.file.filename
  };
  star.avatarUpdate(req.params.emailAddress, req.file.filename, function(err, count){
    if(err){
      res.status(403).send(err);
    }
    else if(count > 0){
      res.send(true);
    }
  });
});

router.get('/api/avatar/:id', function( req, res, next ) {
   res.sendFile( req.params.id, { root : PHOTO_DIRECTORY } );
});


module.exports = router;
