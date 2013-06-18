minispade.require('game.js');

var assert = chai.assert;

describe('Kane.Game', function () {
  var game
    , indexScene = {
        name: 'index',
        update: function (dT) {}, 
        draw: function () {}, 
        onEnter: function () {},
        onExit: function () {},
      }
    , clock = {
        start: function () {},
        stop: function () {},
        getTimeDelta: function () {},
      }; 
  
  //get a new instance of Kane.Game for each test
  beforeEach(function () {
    game = new Kane.Game({
      clock: clock,
      scenes: {
        index: indexScene
      }
    });
  });

  it('should create a new object', function () {
    assert.isObject(game); 
  }); 

  it('should throw if no clock is provided', function () {
    assert.throws(function () {
      game = new Kane.Game({
        scenes: {
          index: indexScene
        }
      })
    });
  });

  it('should throw if no scenes object is provided', function () {
    assert.throws(function () {
      game = new Kane.Game({
        clock: clock
      })
    });
  });

  it('should throw if no index scene is provided', function () {
    assert.throws(function () {
      game = new Kane.Game({
        clock: clock,
        scenes: {}
      })
    });
  });

  it('should set the currentScene to the provided index', function () {
    assert.equal(indexScene, game.getCurrentScene());
  });

  it('should set isRunning to false', function () {
    assert.isFalse(game.isRunning);
  })

  it('should set a reference to itself on each scene', function () {
    assert.equal(game, game.getCurrentScene().game);
  });
  
  describe('#getCurrentScene()', function () {
    it('should be a function', function () {
      assert.isFunction(game.getCurrentScene);
    });

    it('should return the current scene', function () {
      assert.equal(indexScene, game.getCurrentScene());
    });
    
    it('should throw if there is no current scene defined', function () {
      assert.throws(function () {
        game.setCurrentScene(null);
        game.getCurrentScene();
      });
    });
  });

  describe('#setCurrentScene()', function () {
    it('should be a function', function () {
      assert.isFunction(game.setCurrentScene);
    });

    it('should call the previous scenes onExit', function () {});
    it('should call the new scenes onEnter', function () {});

    it('should throw if no string name is provided', function (){
      assert.throws(function () {
        game.setCurrentScene(); 
      });
    });

    it('should assign current scene to provided scene name if it exists otherwise throw', function () {
      var secondScene = {
        name: 'secondScene',
        update: function (dT) {}, 
        draw: function () {}, 
        onEnter: function () {},
        onExit: function () {},
      };

      game = new Kane.Game({
        clock: clock,
        scenes: {
          index: indexScene,
          second: secondScene
        }
      });

      game.setCurrentScene('second');
      assert.equal(secondScene, game.getCurrentScene());

      assert.throws(function () {
        game.setCurrentScene('notValidScene');    
      });
    });
  });

  describe('#start()', function () {
    it('should be a function', function () {
      assert.isFunction(game.start);
    });

    it('should throw if there is no active current Scene', function () {
      assert.throws(function () {
        game.setCurrentScene(null);
        game.start();
      });
    });

    it('should start the loop running', function () {
      game.start();
      assert.isTrue(game.isRunning);
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
  });
});
