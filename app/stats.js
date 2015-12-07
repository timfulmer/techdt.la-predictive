"use strict";
/**
 * Created by timfulmer on 10/22/15.
 */
var http=require('http'),
  Promise=require('bluebird');

function update(options){
  options=options || {};
  function updatePromise(resolve,reject){
    if(!options.bearerToken){
      return reject(new Error('Must have a bearer token.'));
    }
    var params={
      host:'localhost',
      path:'/api/stats/preCalculate',
      port:'8080',
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Accept':'application/json',
        'Authorization':'Bearer '+options.bearerToken
      }
    },
      callback = function(response) {
        if(!response.statusCode || response.statusCode!==200){
          return reject(new Error('Could not update stats.'));
        }
        return resolve(options);
      },
      req=http.request(params, callback);
    req.end();
  }
  return new Promise(updatePromise);
}

module.exports={
  update:update
};