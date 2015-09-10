/**
 * Created by timfulmer on 7/4/15.
 */
var express=require('./config/express'),
  waterline=require('./config/waterline');

waterline
  .initialize()
  .then(function(options){
    return express.initialize(options);
  })
  .catch(function(err){
    console.log('Caught error running server:\n%s.',err.stack);
    process.exit(-1);
  });
