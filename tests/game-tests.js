minispade.require('main.js');

var assert = chai.assert;

describe('Kane.Game', function () {
  var game
    , drawplane = Test.createDrawPlane('test')
    , entities = Test.createEntities(drawplane, 200)
    , entityManager = Test.createEntityManager(entities, drawplane);
  
  //get a new instance of Kane.Game for each test
  beforeEach(function () {
    game = new Kane.Game(entityManager);
  });

  it('should create a new object', function () {
    assert.isObject(game); 
  }); 
  
  describe('#start()', function () {
    it('should be a functiuon', function () {
      assert.isFunction(game.start);
    });

    it('should start the loop running', function () {
      game.start();
      assert.isTrue(game.isRunning);
    });
    
    it('should set the currentTimeStamp', function () {
      game.start();
      assert.notEqual(0, game.currentTimestamp);
    });
  });

  describe('#stop()', function () {
    it('should be a function', function () {
      assert.isFunction(game.stop);
    });

    it('should stop the loop running', function () {
      game.stop();
      assert.isFalse(game.isRunning);
    });

    it('should reset timeStamps to 0', function () {
      game.stop();
      assert.equal(0, game.currentTimeStamp);
      assert.equal(0, game.previousTimeStamp);
    });
  });
});
