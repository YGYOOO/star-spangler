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
