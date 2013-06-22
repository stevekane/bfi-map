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

  keydown: function (keyName) {},
  keyup: function (keyName) {},

  onEnter: function () {},
  onExit: function () {},
  onDraw: function () {},
  onUpdate: function (dT) {},

  name: '',
  initialized: false,
  keyMap: {},
};

/*
Scene objects are rarely created manually and are almost always
instantiated by the Game class during its constructor.  If you need
to construct one manually, be sure to subclass it and add your scene-
specific behavior to the init method
*/
Kane.Scene = function (settings) {
  if (!settings.name) {
    throw new Error('no name provided in settings hash');
  }

  if (!settings.inputWizard) {
    throw new Error('no inputWizard provided in settings hash');
  }

  //set default keyMap
  this.keyMap = {};

  //apply settings object to this scene
  _.extend(this, settings);

  //Listen on inputWizardStream and fire appropriate events
  this.inputWizard.stream.onValue(function (val) {
    //call the appropriate handler for input type
    switch (val.type) {
      case 'keydown':
        this.keydown(val.keyName);
        break;
      case 'keyup':
        this.keyup(val.keyName);
        break;
      //HANDLE MOUSE HERE TOO
    }
  }.bind(this));

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
Kane.Scene.prototype.init = function (settings) {};

Kane.Scene.prototype.update = function (dT) {
  if (!dT) { 
    throw new Error('no dT provided to update'); 
  }
  this.onUpdate(dT);
};

Kane.Scene.prototype.draw = function () {
  this.onDraw();
};

Kane.Scene.prototype.keydown = function (keyName) {
  if (!keyName) {
    throw new Error('no keyName provided to keyDown');
  }
};

Kane.Scene.prototype.keyup = function (keyName) {
  if (!keyName) {
    throw new Error('no keyName provided to keyDown');
  }
};

Kane.Scene.prototype.onEnter = function () {};
Kane.Scene.prototype.onExit = function () {};
Kane.Scene.prototype.onUpdate = function (dT) {};
Kane.Scene.prototype.onDraw = function () {};
