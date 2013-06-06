minispade.require('main.js');

var assert = chai.assert;

describe('Kane.Game', function () {
  var game
    , inputQueue
    , drawplane = Test.createDrawPlane('test')
    , entities = Test.createEntities(drawplane, 200)
    , entityManager = Test.createEntityManager(entities, drawplane);
  
  //get a new instance of Kane.Game for each test
  beforeEach(function () {
    inputQueue = Test.createInputQueue();
    game = new Kane.Game(entityManager, inputQueue);
  });

  it('should create a new object', function () {
    assert.isObject(game); 
  }); 
  
  it('should accept optional args entityManager and inputQueue', function () {
    assert.isDefined(game.entityManager);
    assert.isDefined(game.inputQueue);
  })
  
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
