mocha.setup('bdd');
var assert = chai.assert;

describe('Game', function () {
  var game = new Game();

  it('should create a new object', function () {
    assert.isObject(game); 
  }); 
  
  it('should have start, stop methods', function () {
    assert.isFunction(game.start,'game start defined');
    assert.isFunction(game.stop,'game start defined');
    assert.isFunction(game.getIsRunning, 'game getIsRunning defined');
    assert.isFunction(game.getFPS, 'game getFPS defined');
  });

  it('should expose method to check if running', function () {
    assert.isBoolean(game.getIsRunning());
    assert.isFalse(game.getIsRunning());
  });

  describe('#start()', function () {
    it('should start the loop running', function () {
      game.start();
      assert.isTrue(game.getIsRunning(), 'the game is running');
      game.stop();
    });
  });

  describe('#stop()', function () {
    it('should stop the loop running', function () {
      game.stop();
      assert.isFalse(game.getIsRunning(), 'the game is not running');
    });
  
    it('should set fps to 0', function () {
      game.stop();
      assert.equal(game.getFPS(), 0, 'fps reset to 0');
    });
  });

  describe('#_loop()', function () {
    it('should be undefined since loop is private', function () {
      assert.isUndefined(game.loop, "loop is a 'private method'");
    });
  });

  describe('#getFPS()', function () {
    var game = new Game();

    it('should return 0 if the game is not running', function (done) {
      var fps = game.getFPS();
      assert.equal(fps, 0, 'fps is 0 when game is not running');
      done();
    });

    it('should return fps number if the game is running', function (done) {
      var fps;
      game.start();
      window.setTimeout(function () {
        fps = game.getFPS();
        game.stop();
        assert.isNumber(fps, 'fps returns a a number'); 
        done();
      }, 100);
    });
  });

});
