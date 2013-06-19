minispade.require('game.js');

var assert = chai.assert;

describe('Kane.Game', function () {
  var game
    , Test = {}
    , clock = new Kane.Clock()
    , cache = new Kane.Cache()
    , inputWizard = new Kane.InputWizard({})
    , assetLoader = new Kane.AssetLoader({cache: cache});

  Test.Index = Kane.Scene;
  Test.Ingame = Kane.Scene;
  
  //get a new instance of Kane.Game for each test
  beforeEach(function () {
    game = new Kane.Game({
      namespace: Test, 
      sceneNames: ['Index', 'Ingame']
    });
  });

  it('should create a new object', function () {
    assert.isObject(game); 
  }); 

  it('should throw if no sceneNames object is provided', function () {
    assert.throws(function () {
      game = new Kane.Game({
        namespace: Test
      })
    });
  });

  it('should throw if no namespace is provided', function () {
    assert.throws(function () {
      game = new Kane.Game({
        sceneNames: ['Index', 'Ingame']
      })
    });
  });

  it('should throw if no index scene is provided', function () {
    assert.throws(function () {
      game = new Kane.Game({
        namespace: Test,
        scenes: ['Ingame'] 
      })
    });
  });

  it('should define a clock attribute', function () {
    assert.instanceOf(game.clock, Kane.Clock);
  });

  it('should define a cache attribute', function () {
    assert.instanceOf(game.cache, Kane.Cache);
  });

  it('should define a assetLoader attribute', function () {
    assert.instanceOf(game.assetLoader, Kane.AssetLoader);
  });

  it('should define an inputWizard', function () {
    assert.instanceOf(game.inputWizard, Kane.InputWizard);
  });

  /*
  Here we check if the provided objects are set on the game instance
  */
  it('should set the provided clock as clock attr', function () {
    game = new Kane.Game({
      namespace: Test, 
      sceneNames: ['Index', 'Ingame'],
      clock: clock,
      cache: cache,
      assetLoader: assetLoader,
      inputWizard: inputWizard 
    });
    assert.equal(clock, game.clock);
  });

  it('should set the provided cache as cache attr', function () {
    game = new Kane.Game({
      namespace: Test, 
      sceneNames: ['Index', 'Ingame'],
      clock: clock,
      cache: cache,
      assetLoader: assetLoader,
      inputWizard: inputWizard 
    });
    assert.equal(cache, game.cache);
  });

  it('should set the provided assetLoader as assetLoader attr', function () {
    game = new Kane.Game({
      namespace: Test, 
      sceneNames: ['Index', 'Ingame'],
      clock: clock,
      cache: cache,
      assetLoader: assetLoader,
      inputWizard: inputWizard 
    });
    assert.equal(assetLoader, game.assetLoader);
  });

  it('should set the provided inputWizard as inputWizard attr', function () {
    game = new Kane.Game({
      namespace: Test, 
      sceneNames: ['Index', 'Ingame'],
      clock: clock,
      cache: cache,
      assetLoader: assetLoader,
      inputWizard: inputWizard 
    });
    assert.equal(inputWizard, game.inputWizard);
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
      assert.instanceOf(game.getCurrentScene(), Kane.Scene);
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
      game.setCurrentScene('ingame');
      assert.instanceOf(game.getCurrentScene(), Kane.Scene);

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
