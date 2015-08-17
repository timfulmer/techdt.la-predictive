/**
 * Created by timfulmer on 7/4/15.
 */
var Waterline=require('waterline'),
  orm=new Waterline(),
  mongoAdapter=require('sails-mongo'),
  Promise=require('bluebird'),
  fs=require('fs'),
  _=require('lodash'),
  modelsPath=require('path').join(__dirname,'../app/models'),
  config={
    adapters:{default:mongoAdapter,mongo:mongoAdapter},
    connections:{
      localhostMongo:{
        adapter: 'mongo',host: 'localhost',port: 27017,database: 'test'
      }
    }
  },
  _initializePromise=void 0;

function initialize(options) {
  options=options || {};
  if(!_initializePromise){
    function initializePromise(resolve,reject){
      var schemas=[],
        collections={};
      fs.readdirSync(modelsPath)
        .forEach(function(schemaName) {
          var schema=require('../app/models/'+schemaName);
          schema.loadCollection({waterline:Waterline,orm:orm});
          schemas.push(schemaName.split('.')[0]);
        });
      orm.initialize(config,function(err,models){
        if(err){
          return reject(err);
        }
        options.collections=models.collections;
        return resolve(options);
      });
    }
    _initializePromise=new Promise(initializePromise);
  }
  return _initializePromise;
}

module.exports={
  initialize:initialize
};