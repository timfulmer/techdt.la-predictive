/**
 * Created by timfulmer on 10/20/15.
 */
function loadCollection(options){
  options.orm.loadCollection(
    options.waterline.Collection.extend(
      {
        identity: 'stats',
        connection: 'localhostMongo',
        attributes: {
          playerId:{type:'string',required:true},
          playerSession:{type:'string',required:true},
          playerWins:{type:'number'},
          playerDraws:{type:'number'},
          playerLosses:{type:'number'}
        }
      }
    )
  );
}

module.exports=loadCollection;