/**
 * Created by timfulmer on 7/4/15.
 */
var restify=require('./config/restify'),
  waterline=require('./config/waterline'),
  passport=require('./config/passport');

waterline
  .initialize()
  .then(passport.initialize)
  .then(restify.initialize)
  .catch(function(err){
    console.log('Caught error running server:\n%s.',err.stack);
    process.exit(-1);
  });
