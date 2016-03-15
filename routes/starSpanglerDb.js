var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/starSpangler";

var createUser = function(db, emailAddress, password, callback){
  user =
  {
    emailAddress: emailAddress,
    password: password,
    userType: 'user',
    profile: {
                firstName: '',
                lastName: '',
                userName: '',
                emailAddress: emailAddress,
                avatarImage: '',
                favoriteThings:[]
              },
    rankedDocuments: []
  },
  db.collection('user').insertOne(user, function(err, writeResult){
    if(writeResult.result.ok !== 1){
      callback(err, null);
    }
    else{
      callback(null, writeResult);
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

var createDocuments = function(db, usersList, documentsList, callback){
  db.collection('document').insertOne({usersList: usersList, documentsList: documentsList}, function(err, writeResult){
    if(writeResult.result.ok !== 1){
      callback(err, null);
    }
    else{
      callback(null, writeResult);
    }
  });
}

var findDocuments = function(db, emailAddress, callback){
  var text = ".*gu.*";
  var documents = '';
  db.collection('document').find({"usersList" : new RegExp(text)}).toArray(function(err, result){
    if(result){
      callback(null, result);
    }
  });
}

var rateDocument = function(db, e, dNumber, rank, callback){
  db.collection('user').updateOne(
    {emailAddress : e},
    { $pull: {rankedDocuments:{documentNumber: dNumber}}},
    function(err, result){}
  );
  db.collection('user').updateOne({emailAddress: e}, { $addToSet:{rankedDocuments: {documentNumber: dNumber, rank: rank}}},
    function(err, result){
      if (result.result.nModified > 0) {
        callback(null, result.result.nModified);

      }
      else {
        callback(null, result.result.nModified);
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

module.exports.userCreate = function(emailAddress, callback){
  var password = Math.random().toString(36).slice(-8);
  mongoClient.connect(url, function(err, db){
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    }
    else{
      createUser(db, emailAddress, password, function(err, result){
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

module.exports.documentsCreate = function(usersList, documentsList, callback){
  mongoClient.connect(url, function(err, db){
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    }
    else {
      createDocuments(db, usersList, documentsList, function(err, result){
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

module.exports.documentsFind = function(emailAddress, callback){
  mongoClient.connect(url, function(err, db){
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    }
    else {
      findDocuments(db, emailAddress, function(err, result){
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

module.exports.documentRate = function(emailAddress, dNumber, rank, callback){
  mongoClient.connect(url, function(err, db){
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    }
    else {
      rateDocument(db, emailAddress, dNumber, rank, function(err, result){
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
