/**
 * Created by timfulmer on 7/4/15.
 */
var Waterline=require('waterline'),
  orm=new Waterline(),
  mongoAdapter=require('sails-mongo'),
  Promise=require('bluebird'),
  fs=require('fs'),
  modelsPath=require('path').join(__dirname,'../app/models'),
  config={
    adapters:{default:mongoAdapter,mongo:mongoAdapter},
    connections:{
      localhostMongo:{
        adapter:'mongo',
        host:'ds037234.mongolab.com',
        port:37234,
        user:'nthrows',
        password:'nthrows',
        database:'nthrows'
      }
    }
  },
  _initializePromise=void 0;

function initialize(options) {
  options=options || {};
  if(!_initializePromise){
    function initializePromise(resolve,reject){
      fs.readdirSync(modelsPath)
        .forEach(function(schemaName) {
          require('../app/models/'+schemaName)({waterline:Waterline,orm:orm});
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

module.exports=initialize;