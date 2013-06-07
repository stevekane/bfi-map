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
  
  describe('#addScene()', function () {
    it('should be a function', function () {
      assert.isFunction(game.addScene); 
    });

    it('should throw if no scene with name attr provided', function () {
      assert.throws(function () {
        game.addScene();
      });
      
      assert.throws(function () {
        game.addScene({});
      });

      assert.doesNotThrow(function () {
        game.addScene({name: 'testScene'});
      });
    });

    it('should add a scene to the game object', function () {
      var sceneName = 'testScene'
        , scenes = []
        , targetScene;

      assert.isObject(game.getScenes());
      game.addScene({name: sceneName});
      
      scenes = game.getScenes();
      targetScene = scenes[sceneName];
  
      assert.isObject(targetScene);
    });
  });

  describe('#removeScene()', function () {
    it('should be a function', function () {
      assert.isFunction(game.removeScene);
    });
    
    it('should throw if no name provided', function () {
      assert.throws(function () {
        game.removeScene();
      });
    });

    it('should throw if scene by the provided name is not found', function () {
      assert.throws(function () {
        game.removeScene('noSceneByThisName');
      });
    });

    it('should remove the scene from the list of scenes and return it', function () {
      var sceneName = "testScene"
        , scene = {name: sceneName}
        , removedScene
        , remainingScenes;

      game.addScene(scene);
      removedScene = game.removeScene(sceneName);
      remainingScenes = game.getScenes();

      assert.equal(scene, removedScene);
      assert.isUndefined(remainingScenes[sceneName]);
    });

  });

  describe('#getScenes()', function () {
    it('should be a function', function () {
      assert.isFunction(game.getScenes);
    });
    
    it('should return an object containing all scenes', function () {
      var sceneName = 'testScene'
        , sceneName2 = 'anotherScene'
        , scenes = []
        , targetScene
        , targetScene2;

      assert.isObject(game.getScenes());
      game.addScene({name: sceneName});
      game.addScene({name: sceneName2});
      
      scenes = game.getScenes();
      targetScene = scenes[sceneName];
      targetScene2 = scenes[sceneName2]; 

      assert.isObject(targetScene);
      assert.isObject(targetScene2);
    });
  });

  describe('#getCurrentScene()', function () {
    it('should be a function', function () {
      assert.isFunction(game.getCurrentScene);
    });

    it('should return the current scene', function () {
      var sceneName = "testScene"
        , currentScene; 

      game.addScene({name: sceneName});
      game.setCurrentScene(sceneName);
      currentScene = game.getCurrentScene(); 
  
      assert.isObject(currentScene);
      assert.equal(
        sceneName,
        currentScene.name
      );
    });
    
    it('should throw if there is no current scene defined', function () {
      assert.throws(function () {
        game.getCurrentScene();
      });
    });
  });

  describe('#setCurrentScene()', function () {
    it('should be a function', function () {
      assert.isFunction(game.setCurrentScene);
    });

    it('should throw if no string name is provided', function (){
      assert.throws(function () {
        game.setCurrentScene(); 
      });
    });

    it('should assign current scene to provided scene name if it exists otherwise throw', function () {
      var scene = {name: 'testScene'}; 
    
      game.addScene(scene);

      assert.throws(function () {
        game.setCurrentScene('notValidScene');    
      });
    });

    
  });

  describe('#start()', function () {
    it('should be a function', function () {
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
