/**
 * Created by timfulmer on 7/4/15.
 */
var Promise=require('bluebird'),
  AWS=require('aws-sdk'),
  machineLearning=new AWS.MachineLearning({region: 'us-east-1'}),
  _=require('lodash'),
  throws=[];

/**
 * From http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
 *
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomShot(options){
  function randomShotPromise(resolve,reject){
    if(!options.thro){
      return reject(new Error('Must throw to play.'));
    }
    options.randomOpponentThrow=options.thro.roshambo()[getRandomInt(0,2)];
    return resolve(options);
  }
  return new Promise(randomShotPromise);
}
function machineShot(options){
  function machineShotPromise(resolve,reject){
    var params = {
      MLModelId:'ml-lE1XXsytaka',
      PredictEndpoint:'https://realtime.machinelearning.us-east-1.amazonaws.com',
      Record:{id:options.thro.id}
    };
    function mapPreviousThrows(thro,index){
      return {index:index,thro:thro.playerThrow};
    }
    function reducePreviousThrows(previousThrows,previousThrow){
      previousThrows['previousThrow'+previousThrow.index]=previousThrow.thro;
      return previousThrows;
    }
    _.reduce(_.map(throws,mapPreviousThrows),
      reducePreviousThrows,params.Record);
    machineLearning.predict(params, function(err, data) {
      if (err){
        return reject(err);
      }
      if(!data || !data.Prediction || !data.Prediction.predictedLabel
          || !data.Prediction.predictedScores){
        reject(new Error('Could not find prediction in:\n%s',
          JSON.stringify(data,null,2)));
      }
      throws.push(options.thro);
      if(throws.length===11){
        throws.shift();
      }
      var predictedThro=data.Prediction.predictedLabel,
        predictedThroIndex=options.thro.roshambo().indexOf(predictedThro);
      if(predictedThroIndex===2){
        predictedThroIndex=0;
      }else{
        predictedThroIndex++;
      }
      options.Prediction=data.Prediction;
      options.machineOpponentThrow=options.thro.roshambo()[predictedThroIndex];
      resolve(options);
    });
  }
  return new Promise(machineShotPromise);
}

function shoot(options){
  return randomShot(options)
    .then(machineShot)
    .then(function(options){
      if(options.Prediction && options.Prediction.predictedScores[options.Prediction.predictedLabel]>0.55){
        options.thro.opponentThrow=options.machineOpponentThrow;
      }else{
        options.thro.opponentThrow=options.randomOpponentThrow;
      }
      return options;
    });
}

module.exports={
  shoot:shoot
};