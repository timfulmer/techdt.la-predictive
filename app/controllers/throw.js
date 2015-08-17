/**
 * Created by timfulmer on 7/4/15.
 */
var machine=require('./../machine'),
  collections=void 0;

function shoot(options){
  return collections.throw.create(options.thro)
    .then(function(thro){
      return {thro:thro};
    })
    .then(machine.shoot)
    .then(function(options){
      return options.thro.renderJudgement(options);
    })
    .then(function(options){
      return options.thro.save()
        .then(function(thro){
          options.thro=thro;
          return options;
        })
    });
}

function head(req,res){
  return res.send(200);
}

function getThrows(req,res,next){
  collections.throw
    .find({where:{},sort:'createdAt ASC'})
    .then(function(throws){
      res.send(throws);
      return next();
    })
    .catch(function(err){
      console.log('Could not get throws:\n%s.',err.stack);
      next(err);
    });
}

function postThrow(req,res,next){
  shoot({thro:req.body})
    .then(function(options){
      res.send(options.thro);
      return next();
    })
    .catch(function(err){
      console.log('Could not post throw:\n%s.',err.stack);
      return next(err);
    });
}

function initialize(options){
  options=options || {};
  function initializePromise(resolve,reject){
    if(!options.collections || !options.collections.throw){
      reject(new Error('Could not find throw collection.'));
    }
    collections=options.collections;
    if(options.server){
      options.server.head('/api/throw',head);
      options.server.get('/api/throw',getThrows);
      options.server.post('/api/throw',postThrow);
    }
    resolve(options);
  }
  return new Promise(initializePromise);
}

module.exports={
  initialize:initialize,
  shoot:shoot
};