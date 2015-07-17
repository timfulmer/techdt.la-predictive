var chai=require('chai'),
  chaiAsPromised=require('chai-as-promised');
chai.use(chaiAsPromised);
var expect=chai.expect,
  waterline=require('../../config/waterline');
  machine=require('../../app/machine');

describe('app/',function(){
  var Throw=void 0;
  before(function(){
    return waterline.initialize()
      .then(function(options){
        if(!options || !options.collections || !options.collections.Throw){
          throw new Error('Could not find Throws model.');
        }
        Throw=options.collections.Throw;
      });
  });
  describe('machine',function(){
    describe('.shot',function(){
      it('should generate a random and predictive opponent throw.',function(){
        var thro=Throw.create({playerThrow:'scissors'});
        return machine.shoot({thro:thro});
      });
    });
  });
});