var GameInterface = {
  addScene: function (scene) {},
  removeScene: function (name) {},
  getScenes: function () {},
  getCurrentScene: function () {},
  setCurrentScene: function (name) {},
  start: function () {},
  stop: function () {},

  //required public api attribtues
  isRunning: false
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
};

Kane.Game.prototype = Object.create(GameInterface); 

/*
TODO: consider making this a function and binding 
this to ensure it's 'private'
*/
//private
Kane.Game.prototype._loop = function () {
  var dT
    , inputs = [];

  if (!this.isRunning) { return; }

  //TODO TESTING FOR FPS
  this.fps.begin();

  //update timestamps
  this.previousTimeStamp = this.currentTimeStamp;
  this.currentTimeStamp = Date.now();

  //calculate deltaT
  dT = this.clock.getTimeDelta();

  this.getCurrentScene().update(dT);
    
  //TODO TESTING FOR FPS
  this.fps.end();

  window.requestAnimationFrame(this._loop.bind(this));
};

Kane.Game.prototype.addScene = function (scene) {
  if (!scene) { throw new Error('no scene provided'); } 
  if (!scene.name) { throw new Error('scene must have a name!'); }

  this.scenes[scene.name] = scene;
};

Kane.Game.prototype.removeScene = function (name) {
  var targetScene;
  if (!name) { throw new Error('no name provided'); }
  
  targetScene = this.scenes[name];
  if (!targetScene) { throw new Error('no scene by that name found'); }
  delete this.scenes[name]; 

  return targetScene; 
};

Kane.Game.prototype.getScenes = function () {
  return this.scenes;
};

Kane.Game.prototype.getCurrentScene = function () {
  if (!this.currentScene) { throw new Error('no currentScene defined!'); }
  return this.currentScene;
};

Kane.Game.prototype.setCurrentScene = function (name) {
  var matchingScene;

  if (!name) { throw new Error('scene name not provided!'); } 

  //if the scene does not exist in list of scenes, throw
  matchingScene = this.scenes[name];
  if (!matchingScene) { 
    throw new Error('scene by that name does not exist'); 
  } else {
    this.currentScene = matchingScene;
  } 
  
};

//public
Kane.Game.prototype.start = function () {
  if (!this.currentScene) { 
    throw new Error('must have a currentScene to start!') 
  }
  this.isRunning = true;
  
  //start the clock
  this.clock.start();

  window.requestAnimationFrame(this._loop.bind(this));
  //TESTS FOR FPS MEASUREMENT
  this.fps = createFps();
};

Kane.Game.prototype.stop = function () {
  this.isRunning = false;

  this.clock.stop();
};

//TODO: TESTS FOR FPS MEASUREMENT
function createFps (x, y) {
  var fps = new Stats();
  fps.setMode(0);
  fps.domElement.style.position = 'absolute';
  fps.domElement.style.left = 0;
  fps.domElement.style.top = 0;
  document.body.appendChild(fps.domElement); 
  return fps;
};

