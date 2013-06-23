require('scene.js');

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

  this.gameBoard = new Kane.DrawPlane({
    board: $('#gameboard')
  });
  this.camera = new Kane.Camera({
    scene: this,
    gameBoard: this.gameBoard,
    h: document.height,
    w: document.width
  }); 

  //the scene we will transition to when loading is done
  this.targetSceneName = "ingame";
};

Test.Index.prototype.onEnter = function () {
  console.log('loading assets for ', this.targetSceneName);

  this.text = "loading in progress!";
  //call load assets, last argument is callback upon completion
  this.assetLoader.loadAssets(
    this.name, 
    this.assets, 
    loadingComplete.bind(this)
  );
};

Test.Index.prototype.draw = function () {
  this.camera.gameBoard.clearAll();
  this.camera.gameBoard.renderText(this.text, 'Arial', '30px', 50, 50);
};

//when loading is complete, we will call this function
function loadingComplete (errors) {
  if (0 < errors.length) {
    console.log(errors, ' failed to load');
  } else {

    this.text = "load complete press enter!";

    //this.game.setCurrentScene(this.targetSceneName);
    this.keyup = function (keyName) {
      if ('enter' === keyName) {
        this.game.setCurrentScene(this.targetSceneName);
      }

    };
  }
};
