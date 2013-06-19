require('engine.js');

var GameInterface = {
  getCurrentScene: function () {},
  setCurrentScene: function (name) {},
  start: function () {},
  stop: function () {},

  //required public api attribtues
  isRunning: false,
  cache: null,
  assetLoader: null,
  clock: null,
  inputWizard: null
  
};

Kane.Game = function (settings) {
  //required attribute checks for scenes and namespace
  if (!settings.sceneNames) {
    throw new Error('no sceneNames array provided to constructor');
  }
  
  if (!settings.namespace) {
    throw new Error('no namespace provided to constructor');
  }

  if (!_(settings.sceneNames).contains('Index')) {
    throw new Error('no Index included in sceneNames');
  }


  //construct our empty scenes object
  this.scenes = {};

  /*
  grab all the values from settings
  this may include already created instances of:
  clock
  inputWizard
  cache
  assetLoader 
  */
  _.extend(this, settings);

  //check if these optional values are defined, if not use defaults
  this.clock = this.clock ? this.clock : new Kane.Clock();
  
  //default inputWiz attaches to document.body
  this.inputWizard = 
    this.inputWizard ? 
    this.inputWizard : 
    new Kane.InputWizard({});
  
  this.cache = 
    this.cache ?
    this.cache :
    new Kane.Cache();

  //loader requires a ref to the cache
  this.assetLoader = 
    this.assetLoader ?
    this.assetLoader :
    new Kane.AssetLoader({
      cache: this.cache
    });

  /*
  check array of scene names by inspecting the provided namespace
  if the scene is found, instantiate it otherwise throw
  
  NOTE: scenes MAY very well need more than what is injected onto
  them here.  This is handled in the constructor for the scene which
  should call some method or do additional injection to create
  needed objects.  This includes things like cameras, entitymanager, etc
  */
  _(this.sceneNames).each(function (sceneName) {
    var namespace = this.namespace
      , targetScene = namespace[sceneName]
      , camelCaseName = Kane.Utils.camel(sceneName);

    if (!targetScene) {
      throw new Error(sceneName, ' not found on ', namespace);
    } else {
      this.scenes[camelCaseName] = new targetScene({
        name: camelCaseName,
        game: this,
        cache: this.cache,
        assetLoader: this.assetLoader,
        inputWizard: this.inputWizard  
      });
    }
  }, this);

  //set the currentScene to index
  this.currentScene = this.scenes.index;
  
  //set isRunning
  this.isRunning = false;

  //TODO: Perhaps call configure method on the scenes here?
  //Probably better to have them call their own
  
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

  //call the current Scene's onEnter
  this.currentScene.onEnter();

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
