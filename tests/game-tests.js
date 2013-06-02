minispade.require('main.js');

var assert = chai.assert;

describe('Kane.Game', function () {
  var game;
  
  //get a new instance of Kane.Game for each test
  beforeEach(function () {
    game = new Kane.Game();
  });

  it('should create a new object', function () {
    assert.isObject(game); 
  }); 
  
  it('should have start, stop methods', function () {
    assert.isFunction(game.start);
    assert.isFunction(game.stop);
  });

  describe('#start()', function () {
    it('should start the loop running', function () {
      game.start();
      assert.isTrue(game.isRunning);
    });
  });

  describe('#stop()', function () {
    it('should stop the loop running', function () {
      game.stop();
      assert.isFalse(game.isRunning);
    });
  });
});
