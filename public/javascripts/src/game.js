require('kane.js');

var GameInterface = {
  getCurrentScene: function () {},
  setCurrentScene: function (name) {},
  start: function () {},
  stop: function () {},

  //required public api attribtues
  isRunning: false,
};

Kane.Game = function (settings) {
  if (!settings.clock) { 
    throw new Error('no clock provided to game'); 
  }

  if (!settings.scenes) {
    throw new Error('no scenes object provided to constructor');
  }
  
  if (!settings.scenes.index) {
    throw new Error('no index scene provided in scenes object to constructor');
  }

  _.extend(this, settings);  

  //set reference to game on each scene
  _(this.scenes).each(function (scene) {
    scene.game = this;
  }, this);

  //set the current scene to the provided index scene
  this.currentScene = settings.scenes.index;  

  this.isRunning = false;
};

Kane.Game.prototype = Object.create(GameInterface); 

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

    //do nothing if this is the current scene
    if (oldScene.name === name) {
      return;
    }
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
  _(this.scenes).each(function (scene) {
    scene.update(dT)
  }, this);
};

//draw method called on requestAnimationFrame
function draw () {
  if (!this.isRunning) { return; }

  this.getCurrentScene().draw();
  window.requestAnimationFrame(draw.bind(this));
};
