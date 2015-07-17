/**
 * Created by timfulmer on 7/5/15.
 */
var restify=require('restify'),
  fs=require('fs'),
  Promises=require('bluebird'),
  controllersPath=require('path').join(__dirname,'../app/controllers');

function initialize(options){
  function initializePromise(resolve,reject){
    var server=restify.createServer({name:'Roshambo'}),
      promises=[];
    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    fs.readdirSync(controllersPath)
      .forEach(function(controllerName) {
        var controller=require('../app/controllers/'+controllerName);
        promises.push(controller.initialize(
          {collections:options.collections,server:server}));
      });
    Promises.all(promises)
      .then(function(){
        server.listen(8080,function(){
          console.log('%s listening at %s', server.name, server.url);
          options.server=server;
          return resolve(options);
        });
      })
      .catch(function(err){
        return reject(err);
      });
  }
  return new Promise(initializePromise);
}

module.exports={
  initialize:initialize
};