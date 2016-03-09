var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');

router.get('/', function(req, res, next) {
   res.sendFile( 'index.html', { root : __dirname + "/../public" } );
});


var remoteGet = function(options, callback){
  var req = https.request(options, function(res){
    console.log('0.1');
    var output = [];

    res.on('data', function(chunk){
      console.log('1');
      output.push(chunk);
    });

    res.on('end', function(){
      console.log('2');
      var str = output.join('');
      try {
         str = JSON.parse( str );
      } catch(err) {
      }

      callback(res.statusCode, str);
    })
  });

  req.on('error', function(error){
    console.log('3');
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
 console.log( host+path );
  var options = {
    host: host,
    path: path,
    method:'GET',
    // headers : {
    //   'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    //   'Accept-Encoding':'gzip, deflate, sdch',
    //   'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
    //   'Cache-Control':'no-cache',
    //   'Connection':'keep-alive',
    //   'Cookie':'ab_group=1; __utma=205667716.1089167854.1457212150.1457212150.1457212162.2; __utmb=205667716.7.10.1457212162; __utmc=205667716; __utmz=205667716.1457212162.2.2.utmcsr=homepage|utmccn=(not%20set)|utmcmd=slideshow|utmcct=header; javascript_enabled=1; connect.sid=okQEPayW9Q8sBSSMgvYB7rYE.MIZlcjX8mt3w4KfLnMrfMiTGWxsLqeZU6T8pfySNQLU',
    //   'Host':'www.federalregister.gov',
    //   'Pragma':'no-cache',
    //   'Upgrade-Insecure-Requests':'1',
    //   'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
    // }
  };

  remoteGet(options, function(status, data){
    res.status(status).send(data);
  })
});

module.exports = router;
