/**
 * Created by timfulmer on 7/4/15.
 */
var roshambo=['rock','paper','scissors'],
  playerTypes=['human','machine'],
  outcomes=['player','opponent','draw'];

function transformJudgement(player,opponent,draw){
  if(draw){
    return 'draw';
  }
  if(player){
    return 'player';
  }
  if(opponent){
    return 'opponent';
  }
  throw new Error('Could not render judgement.');
}
function renderJudgement(options){
  function renderJudgementPromise(resolve,reject){
    if(!options.thro.playerThrow || !options.thro.playerType
        || !options.thro.opponentThrow || !options.thro.opponentType){
      reject(new Error('Not enough information to render judgement.'));
    }
    switch(options.thro.playerThrow){
      case 'rock': options.thro.outcome=transformJudgement(
          options.thro.opponentThrow==='scissors',
          options.thro.opponentThrow==='paper',
          options.thro.opponentThrow==='rock'
        );
        break;
      case 'paper': options.thro.outcome=transformJudgement(
          options.thro.opponentThrow==='rock',
          options.thro.opponentThrow==='scissors',
          options.thro.opponentThrow==='paper'
        );
        break;
      case 'scissors': options.thro.outcome=transformJudgement(
          options.thro.opponentThrow==='paper',
          options.thro.opponentThrow==='rock',
          options.thro.opponentThrow==='scissors'
        );
        break;
      default:
        return reject(new Error('Could not render judgement.'));
    }
    resolve(options);
  }
  return new Promise(renderJudgementPromise);
}

function loadCollection(options){
  options.orm.loadCollection(
    options.waterline.Collection.extend(
      {
        identity: 'throw',
        connection: 'localhostMongo',
        attributes: {
          playerThrow:{type:'string',required:true,in:roshambo},
          playerType:{type:'string',in:playerTypes,defaultsTo:'human'},
          playerId:{type:'string',required:true},
          playerSession:{type:'string',required:true},
          opponentThrow:{type:'string',in:roshambo},
          opponentType:{type:'string',in:playerTypes,defaultsTo:'machine'},
          opponentId:{type:'string'},
          opponentSession:{type:'string'},
          outcome:{type:'string',in:outcomes},
          orderBy:{type:'integer'},
          roshambo:function(){
            return roshambo;
          },
          renderJudgement:function(options){
            return renderJudgement(options);
          }
        }
      }
    )
  );
}

module.exports=loadCollection;