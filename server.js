/**
 * Created by timfulmer on 7/4/15.
 */
var restify=require('./config/restify'),
  waterline=require('./config/waterline');

waterline
  .initialize()
  .then(function(options){
    return restify.initialize(options);
  })
  .catch(function(err){
    console.log('Caught error running server:\n%s.',err.stack);
    process.exit(-1);
  });
