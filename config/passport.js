/**
 * Created by timfulmer on 7/26/15.
 */
var passport = require('passport'),
  BearerStrategy = require('passport-http-bearer').Strategy,
  Promise=require('bluebird'),
  http=require('http');

function initialize(options){
  options=options || {};
  function initializePromise(resolve){

    passport.serializeUser(function(user,done) {
      return done(new Error('Sessions are not supported, please request an access token.'));
    });

    passport.deserializeUser(function(id,done) {
      return done(new Error('Sessions are not supported, please request an access token.'));
    });

    passport.use("accessToken", new BearerStrategy(
      function (accessToken, done) {
        function responseCallback(response){
          var contents='';
          response.on('data',function(chunk){
            contents+=chunk;
          });
          response.on('end',function(){
            if(contents!=='Unauthorized'){
              try{
                var authorization=JSON.parse(contents);
                if(authorization && authorization.authorized){
                  // TODO: Hash the access token to make a session id.
                  authorization.user.session=accessToken;
                  return done(null,authorization.user,authorization.info);
                }
              }catch(err){
                // Noop.
              }
            }
            return done(null, false);
          });
        }
        var request={
            host:'localhost',
            path:'/api/authorize',
            port:'8081',
            headers:{Authorization:'Bearer '+accessToken}
          },
          req = http.request(request,responseCallback);
        req.end();
      }
    ));

    options.passport=passport;
    return resolve(options);
  }
  return new Promise(initializePromise);
}

module.exports=initialize;