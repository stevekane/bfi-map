require('kane.js');

/*
update and draw generally should be left alone.  
They both expose hooks for calling onUpdate and 
onDraw which may be defined however you desire

onEnter and onExit may be defined to do w/e you desire 
and they will be called by the game object that owns 
this scene on scene transitions 
*/
var SceneInterface = {
  init: function(settings) {},
  update: function (dT) {},
  draw: function () {},

  keyDown: function (keyName) {},
  keyUp: function (keyName) {},

  onEnter: function () {},
  onExit: function () {},
  onDraw: function () {},
  onUpdate: function (dT) {},

  name: '',
  initialized: false,
  keyMap: {},
};

/*
note, if the settings provided include a name it 
will be overwritten by the provided name 
*/
Kane.Scene = function (settings) {
  if (!settings.name) {
    throw new Error('no name provided in settings hash');
  }

  //set default keyMap
  this.keyMap = {};

  //apply settings object to this scene
  _.extend(this, settings);

  /*
  This is extremely important to call!
  when you want to 'subclass' scene be certain to call this
  or better yet, don't override the constructor
  instead, add your constructions details/implementation to
  init
  */
  this.initialized = false;
  this.init(settings);
  this.initialized = true;
};

Kane.Scene.prototype = Object.create(SceneInterface);

/*
This method is responsible for instantiating and wiring together
whatever additional objects your scene may require.  Examples include:
entityManager (or multiple?)
camera
world (perhaps?)
and customization for what should be sent to the loader
*/
Kane.Scene.prototype.init = function (settings) {
};

Kane.Scene.prototype.update = function (dT) {
  if (!dT) { 
    throw new Error('no dT provided to update'); 
  }
  this.onUpdate(dT);
};

Kane.Scene.prototype.draw = function () {
  this.onDraw();
};

Kane.Scene.prototype.keyDown = function (keyName) {
  var action;

  if (!keyName) {
    throw new Error('no keyName provided to keyDown');
  }

  //identify our action from the keyMap
  action = this.keyMap[keyName].keyDown;

  //if there is an action, execute it
  if (action) {
    action.call(this);
  }
};

Kane.Scene.prototype.keyUp = function (keyName) {
  var action;

  if (!keyName) {
    throw new Error('no keyName provided to keyDown');
  }

  //identify our action from the keyMap
  action = this.keyMap[keyName].keyUp;

  //if there is an action, execute it
  if (action) {
    action.call(this);
  }
};

Kane.Scene.prototype.onEnter = function () {};
Kane.Scene.prototype.onExit = function () {};
Kane.Scene.prototype.onUpdate = function (dT) {};
Kane.Scene.prototype.onDraw = function () {};
