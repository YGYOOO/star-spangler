var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/starSpangler";

var createUser = function(db, user, callback){
  db.collection('user').insertOne(user, function(err, writeResult){
    if(writeResult.result.ok !== 1){
      callback(err, null);
    }
    else{
      callback(null, user);
    }
  });
}

var findOneUser = function(db, emailAddress, callback){
  db.collection('user').findOne({emailAddress: emailAddress}, function(err, thing){
    db.close();
    if(thing){
      callback(null, thing);
    }
    else{
      callback(null, null);
    }
  })
}

var findUsers = function(db, callback){
  db.collection('user').find().toArray(function(err, results){
    db.close();
    if(results){
      callback(null, results);
    }
    else{
      callback(null, null);
    }
  });
}

var updateUserType = function(db, e, type, callback){
  db.collection('user').update({emailAddress: e}, {$set: {userType: type}}, function(err, count, result){
    db.close();
    if(result){
      callback(null, result);
    }
    else{
      callback(err, null);
    }
  });
}

module.exports.userTypeUpdate = function(e, type, callback){
  mongoClient.connect(url, function(err, db){
    if(err){
      callback(err, null);
    }
    else {
      updateUserType(db, e, type, callback);
    }
  });
}

module.exports.usersFind = function(callback){
  mongoClient.connect(url, function(err, db){
    if(err){
      callback(err, null)
    }
    else{
      findUsers(db, callback);
    }
  });
}

module.exports.userFindOne = function(emailAddress, callback){
  mongoClient.connect(url, function(err, db){
    if(err){
      callback(err, null);
    }
    else{
      findOneUser(db, emailAddress, callback);
    }
  });
}

module.exports.userCreate = function(user, callback){
  console.log('2');
  mongoClient.connect(url, function(err, db){
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    }
    else{
      createUser(db, user, function(err, result){
        db.close();
        if(err){
          callback(err, null);
        }
        else {
          callback(null, result);
        }
      });
    }
  });
}
