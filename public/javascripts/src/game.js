var GameInterface = {
  addScene: function (scene) {},
  removeScene: function (name) {},
  getScenes: function () {},
  getCurrentScene: function () {},
  setCurrentScene: function (name) {},
  start: function () {},
  stop: function () {},

  //required public api attribtues
  isRunning: false,
  //reference to game object that owns this scene
  game: null
};

Kane.Game = function (settings) {
  if (!settings.clock) { 
    throw new Error('no clock provided to game'); 
  }

  _.extend(this, settings);  

  //a scenes object
  this.scenes = {};
  this.currentScene = null;

  this.isRunning = false;
  this.game = null;
};

Kane.Game.prototype = Object.create(GameInterface); 

Kane.Game.prototype.addScene = function (scene) {
  if (!scene) { 
    throw new Error('no scene provided'); 
  } 
  if (!scene.name) { 
    throw new Error('scene must have a name!'); 
  }

  /*
  we need to add a reference to the game object onto this scene
  this is used by scenes to make calls to "setCurrentScene" and other
  scene related methods on the game object
  */
  scene.game = this; 

  this.scenes[scene.name] = scene;
};

Kane.Game.prototype.removeScene = function (name) {
  var targetScene;

  if (!name) { 
    throw new Error('no name provided'); 
  }
  
  targetScene = this.scenes[name];

  if (!targetScene) { 
    throw new Error('no scene by that name found'); 
  }

  delete this.scenes[name]; 

  return targetScene; 
};

Kane.Game.prototype.getScenes = function () {
  return this.scenes;
};

Kane.Game.prototype.getCurrentScene = function () {
  if (!this.currentScene) { 
    throw new Error('no currentScene defined!'); 
  }
  return this.currentScene;
};

Kane.Game.prototype.setCurrentScene = function (name) {
  var matchingScene
    , oldScene;

  if (!name) { 
    throw new Error('scene name not provided!'); 
  } 

  //if the scene does not exist in list of scenes, throw
  matchingScene = this.scenes[name];
  if (!matchingScene) { 
    throw new Error('scene by that name does not exist'); 
  }
    
  //capture the previous Scene
  oldScene = this.currentScene;

  //call old scene's onExit hook
  if (oldScene) { 
    oldScene.onExit.call(oldScene) 
  };

  //call new scene's onEnter hook
  matchingScene.onEnter.call(matchingScene);
   
  this.currentScene = matchingScene;
};

//public
Kane.Game.prototype.start = function () {
  if (!this.currentScene) { 
    throw new Error('must have a currentScene to start!') 
  }
  this.isRunning = true;
  
  //start the clock
  this.clock.start();

  //call update at fixed interval
  window.setInterval(update.bind(this), this.interval || 25);

  //start the draw method firing on every render
  window.requestAnimationFrame(draw.bind(this));
};

Kane.Game.prototype.stop = function () {
  this.isRunning = false;
  this.clock.stop();
};


//increment game logic
function update () {
  if (!this.isRunning) { return; }

  var dT = this.clock.getTimeDelta();
  _(this.scenes).each(function (element) {
    element.update(dT)
  }, this);
};

//draw method called on requestAnimationFrame
function draw () {
  if (!this.isRunning) { return; }

  this.getCurrentScene().draw();
  window.requestAnimationFrame(draw.bind(this));
};

