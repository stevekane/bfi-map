require('engine.js');

//inherit the basic behavior from Kane.Scene
Test.Index = function (settings) {
  Kane.Scene.call(this, settings);
};

//inherit from scene's prototype
Test.Index.prototype = Object.create(Kane.Scene.prototype);

Test.Index.prototype.init = function (settings) {
  //declare some assets we want to load
  this.assets = ['public/images/spritesheet.png',
                 'public/json/spritesheet.json']; 

  //the scene we will transition to when loading is done
  this.targetSceneName = "index";
};

Test.Index.prototype.onEnter = function () {
  console.log('loading assets for ', this.targetSceneName);

  //call load assets, last argument is callback upon completion
  this.assetLoader.loadAssets(
    this.name, 
    this.assets, 
    loadingComplete.bind(this)
  );
};

//when loading is complete, we will call this function
function loadingComplete (errors) {
  if (0 < errors.length) {
    console.log(errors, ' failed to load');
  } else {
    this.game.setCurrentScene(this.targetSceneName);
  }
};

//define our 'ingame scene'
Test.Ingame = function (settings) {
  Kane.Scene.call(this, settings);
};

//again, we set the prototype to Kane.Scene's prototype
Test.Ingame.prototype = Object.create(Kane.Scene.prototype);

Test.Ingame.prototype.init = function (settings) {
  //setup an entityManager
  this.entityManager = new Kane.EntityManager();  
  this.gameBoard = new Kane.DrawPlane({
    board: $('#gameboard')
  });
  this.camera = new Kane.Camera({
    scene: this,
    gameBoard: gameBoard
  }); 
};
