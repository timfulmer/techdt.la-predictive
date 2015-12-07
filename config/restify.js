"use strict";
/**
 * Created by timfulmer on 7/5/15.
 */
var restify=require('restify'),
  fs=require('fs'),
  Promises=require('bluebird'),
  controllersPath=require('path').join(__dirname,'../app/controllers');

function authorizeRedirectUrl(req,res,done){
  var scopes=req.authInfo.scope,
    found=false;
  scopes.some(function(scope){
    if(scope.indexOf(req.headers.host)>-1 || scope.endsWith(req.url)){
      found=true;
      return true;
    }
    return false;
  });
  if(!found){
    res.send(401,'Unauthorized');
  }
  done();
}

function initialize(options){
  options=options || {};
  function initializePromise(resolve,reject){
    var server=restify.createServer({name:'Roshambo'}),
      promises=[];
    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    if(options.authorize){
      server.use(options.passport.authenticate('accessToken',{session:false}));
      server.use(authorizeRedirectUrl);
    }
    options.server=server;
    fs.readdirSync(controllersPath)
      .forEach(function(controllerName) {
        promises.push(require('../app/controllers/'+controllerName)(options));
      });
    Promises.all(promises)
      .then(function(){
        server.listen(8080,function(){
          console.log('%s listening at %s', server.name, server.url);
          return resolve(options);
        });
      })
      .catch(function(err){
        return reject(err);
      });
  }
  return new Promise(initializePromise);
}

module.exports=initialize;