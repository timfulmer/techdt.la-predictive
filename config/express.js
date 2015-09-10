/**
 * Created by timfulmer on 7/5/15.
 */
var express=require('express'),
  fs=require('fs'),
  bodyParser = require('body-parser'),
  Promise=require('bluebird'),
  controllersPath=require('path').join(__dirname,'../app/controllers');

function initialize(options){
  options=options || {};
  function initializePromise(resolve,reject){
    var app=express(),
      promises=[];
    app.locals.title='Roshambo';
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(bodyParser.json());
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    if(options.passport){
      app.use(options.passport.initialize());
    }
    options.server=app;
    fs.readdirSync(controllersPath)
      .forEach(function(controllerName) {
        var controller=require('../app/controllers/'+controllerName);
        promises.push(controller.initialize(options));
      });
    Promise.all(promises)
      .then(function(){
        var server=app.listen(8080,function(){
          console.log('%s listening at http://%s:%s',app.locals.title,
            server.address().address,server.address().port);
          options.expressServer=server;
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