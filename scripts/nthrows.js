/**
 * Created by timfulmer on 7/4/15.
 */
var waterline=require('../config/waterline'),
  throws=require('../app/controllers/throw'),
  Promise=require('bluebird'),
  fs=require('fs'),
  Throw=void 0,
  playerId='prs001@mailinator.com',
  playerSession='session002';

function populateThrows(){
  var p=[],i,count=10,order=0;
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'rock',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'paper',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'scissors',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'paper',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'rock',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'scissors',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'paper',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'scissors',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'rock',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'paper',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'rock',playerType:'machine',orderBy:order++}}));
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'paper',playerType:'machine',orderBy:order++}}));
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'scissors',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'paper',playerType:'machine',orderBy:order++}}));
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'rock',playerType:'machine',orderBy:order++}}));
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'scissors',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'scissors',playerType:'machine',orderBy:order++}}));
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'rock',playerType:'machine',orderBy:order++}}));
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'paper',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'rock',playerType:'machine',orderBy:order++}}));
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'scissors',playerType:'machine',orderBy:order++}}));
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'paper',playerType:'machine',orderBy:order++}}));
  }
  for(i=0;i<count;i++){
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'paper',playerType:'machine',orderBy:order++}}));
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'scissors',playerType:'machine',orderBy:order++}}));
    p.push(throws.shoot({thro:{playerId:playerId,playerSession:playerSession,playerThrow:'rock',playerType:'machine',orderBy:order++}}));
  }
  return Promise.all(p);
}

function csvThrows(options){
  function csvThrowsPromise(resolve){
    var previous=[],
      playerCsv='id,previousThrow0,previousThrow1,previousThrow2,previousThrow3,'+
        'previousThrow4,previousThrow5,previousThrow6,previousThrow7,'+
        'previousThrow8,previousThrow9,playerThrow\n';
    options.throws.forEach(function(thro){
      previous.push(thro);
      if(previous.length===11){
        playerCsv+=(thro.id+',');
        previous.forEach(function(csvThro,index){
          playerCsv+=csvThro.playerThrow;
          if(index!==10){
            playerCsv+=',';
          }
        });
        playerCsv+='\n';
        previous.shift();
      }
    });
    console.log(playerCsv);
    return resolve({csv:playerCsv});
  }
  return new Promise(csvThrowsPromise);
}

function writeCsv(options){
  function writeCsvPromise(resolve,reject){
    fs.writeFile("../data/histogram.csv", options.csv, function(err) {
      if(err) {
        return reject(err);
      }
      resolve(options);
    });
  }
  return new Promise(writeCsvPromise);
}

waterline()
  .then(function(options) {
    if (!options.collections || !options.collections['throw']) {
      throw new Error('Could not access Throw data.');
    }
    Throw=options.collections['throw'];
    return options;
  })
  .then(throws)
  .then(function(){
    return Throw.destroy({});
  })
  .then(populateThrows)
  .then(function(){
    return Throw.find({where:{},sort:'orderBy ASC'});
  })
  .then(function(throws){
    return csvThrows({throws:throws});
  })
  .then(function(options){
    return writeCsv(options);
  })
  .catch(function(err){
    console.log('Caught error exporting nthrows:\n%s.',err.stack);
    process.exit(1);
  })
  .finally(function(){
    process.exit(0);
  });