minispade.register('animation.js', function() {
"use strict";
/*
An Animation should define the x, y, w, h of each frame that is found 
on a provided spritesheet (Kane.Image).  

when an animation is running the following happens:

determine if the frametime for the current frame has elapsed
If so, it should advance to the next frame
if not, it should re-render the current frame

if the frame being rendered is the last frame, it should check
the 'shouldLoop' flag to determine if it should go to the first frame
or simply stop

To create an animation, you must provide an instance of an Image
and an array of Kane.Frames
*/
minispade.require('kane.js');
minispade.require('frame.js');
minispade.require('clock.js');

var AnimationInterface = {
  start: function (frameNum) {},
  stop: function () {},
  getCurrentFrame: function () {},

  fps: null,
  frameInterval: null,
  startTime: null
};

Kane.Animation = function (settings) {
  var error;

  if (!settings.image) { error = "no valid image provided"; }
  if (!(settings.frames instanceof Array)) { 
    error = "no frames array provided"; 
  }
  if (error) { throw new Error(error) }

  //SET DEFAULTS FOR INTERFACE ATTRS
  //defines number of frames shown per second
  this.fps = 24;

  //more useful value for determining active frame (ms/frame)
  this.frameInterval = 1 / (this.fps / 1000);

  //capture the time this animation started
  this.startTime = Date.now();

  //this clock instance is used to track animation progress
  this.clock = new Kane.Clock();

  _.extend(this, settings);
};

Kane.Animation.prototype = Object.create(AnimationInterface);

Kane.Animation.prototype.start = function (frameNum) {
  //start our clock
  this.clock.start(); 

  //if frameNum specified, start there else start at 0
  this.currentFrame = frameNum ? this.frames[frameNum] : this.frames[0];
};

Kane.Animation.prototype.stop = function () {
  //stop the clock
  this.clock.stop();   
};

Kane.Animation.prototype.getCurrentFrame = function () {
  return this.currentFrame;  
};

});

minispade.register('assetloader.js', function() {
"use strict";
/*
Asset loaders is solely responsible for reaching out to 
the server to retrive assets for use in the game.  

FILETYPES SUPPORTED:
.json  
.png
.jpg
*/
minispade.require('kane.js');
minispade.require('utils.js');

var AssetLoaderInterface = {
  loadAssets: function (groupName, assets, callback) {} 
};

Kane.AssetLoader = function (settings) {
  if (!settings.cache) {
    throw new Error('no cache provided to constructor');
  } 

  /*
  all are k/v pairs 
  k = groupName, v = remaining assets to load from that group
  k = groupName, v = array of filenames that failed to load
  k = groupName, v = callback when group is loaded 
  */
  this.assetCounters = {};
  this.errors = {};
  this.callbacks = {};

  _.extend(this, settings);
};

Kane.AssetLoader.prototype = Object.create(AssetLoaderInterface);

//format of callback is function (errors) {} where 
//errors is an arrayof filenames that failed to load
Kane.AssetLoader.prototype.loadAssets = function (groupName, assets, callback) {
  if (!groupName) {
    throw new Error('no groupName provided!');
  }
  if (!assets) {
    throw new Error('no assets provided!');
  }
  if (!callback) {
    throw new Error('no callback provided!');
  }

  var jsonAssets = _(assets).filter(filterByFileType('.json')).value()
    , pngAssets = _(assets).filter(filterByFileType('.png')).value()
    , jpgAssets = _(assets).filter(filterByFileType('.jpg')).value()
    , imageAssets = pngAssets.concat(jpgAssets);

  //set assetCounter, errors, and callback for this group
  initializeGroup(this, groupName, assets.length, callback);

  //call our load JSON function
  loadJSON(this, jsonAssets, groupName);

  //call our load Images function
  loadImages(this, imageAssets, groupName);
};

function loadJSON (loader, assetNames, groupName) {
  //console.log('inside loadJSON with ', assetNames, groupName);
  for (var i=0; i<assetNames.length; i++) {
    var assetName = assetNames[i];  

    $.getJSON(assetName)
      .done(function (json) {
        //cache the asset
        loader.cache.cache(Kane.Utils.stripFilePath(assetName), json);
      })
      .fail(function () {
        //push assetName onto errors array
        loader.errors[groupName].push(assetName);
      })
      .always(function () {
        //decrease this groups assetCount
        loader.assetCounters[groupName]--;
        //check if this group is done loading
        checkIfGroupIsDone(loader, groupName);
      });
  };
};

/*
function that takes a loader class, a list of assetNames, 
and a groupName it creates an Image object, initiates an 
XHR for the image, and sets up callbacks for successful 
load and error
*/
function loadImages (loader, assetNames, groupName) {
  for (var i=0; i<assetNames.length; i++) {
    var assetName = assetNames[i]
      , img = new Image();

    img.src = assetName;

    //load callback
    img.onload = function () {
      //cache the image asset
      loader.cache.cache(Kane.Utils.stripFilePath(assetName), img);

      //decrease this groups assetCount
      loader.assetCounters[groupName]--;

      //check if group is done loading
      checkIfGroupIsDone(loader, groupName);
    };

    //error callback
    img.onerror = function () {
      //push assetName onto errors array
      loader.errors[groupName].push(assetName);
      
      //decrease this groups assetCount
      loader.assetCounters[groupName]--;

      //check if this group is done loading
      checkIfGroupIsDone(loader, groupName);
    };
  }
};

//initialize a loader's assetCounter, errors, and callback
function initializeGroup (loader, groupName, assetsLength, callback) {
  loader.assetCounters[groupName] = assetsLength;
  loader.errors[groupName] = [];
  loader.callbacks[groupName] = callback;
};

/*
if a group's asset counter is 0 then there 
are no more items to load so call that group's callback 
and pass in the content of that groups errors
*/
function checkIfGroupIsDone(loader, groupName) {
  var callback = loader.callbacks[groupName]
    , errors = loader.errors[groupName]
    , assetCounter = loader.assetCounters[groupName];

  if (0 === assetCounter) {
    callback(errors);
  }  
};

//pass a file extension (including ".") and it will return a filter function
function filterByFileType (extension) {
  return function (name) {
    return (-1 !== name.indexOf(extension)); 
  };
};

});

minispade.register('cache.js', function() {
"use strict";

minispade.require('kane.js');

var CacheInterface = {
  cache: function (name, asset) {},
  flushByName: function (name) {},
  flush: function () {},
  getByName: function (name) {},
  allInCache: function (nameArray) {},
};

Kane.Cache = function (settings) {
  _.extend(this, settings);

  this.store = {};
};

Kane.Cache.prototype = Object.create(CacheInterface);

Kane.Cache.prototype.cache = function (name, asset) {
  if (!name) {
    throw new Error('no name provided for the object');
  }
  if (!asset) {
    throw new Error('no asset provided for the object');
  }
  this.store[name] = asset; 
};

Kane.Cache.prototype.flushByName = function (name) {
  delete this.store[name];
};

Kane.Cache.prototype.flush = function () {
  this.store = {};
};

Kane.Cache.prototype.getByName = function (name) {
  return this.store[name];
};

/*
this is most often used by objects to determine if everything they
need is loaded and available in the cache
*/
Kane.Cache.prototype.allInCache = function (nameArray) {
  return _(nameArray).every(function (name) {
    return Boolean(this.getByName(name));
  }, this);
};

});

minispade.register('camera.js', function() {
"use strict";

minispade.require('kane.js');
minispade.require('utils.js');

var CameraInterface = {
  update: function (dT) {},
  draw: function () {},
  setSize: function (w, h) {},

  //public interface attributes
  x: 0,
  y: 0,

  //previous positions
  lastx: 0,
  lasty: 0,  

  //dimensions
  w: 640,
  h: 480,
  
  //velocity
  dx: 0,
  dy: 0,
  
  //accel
  ddx: 0,
  ddy: 0,
};

/*
Cameras must be instantiated with a scene object
the scene tells the camera to draw at 60fps and it provides
the data for the camera to draw

the camera MUST be attached to a scene before it is made active
*/
Kane.Camera = function (settings) {
  if (!settings.gameBoard) {
    throw new Error('no gameBoard object provided to constructor');
  }

  if (!settings.scene) {
    throw new Error('no scene provided to constructor');
  }
  _.extend(this, settings);

  //set the size of the camera and all drawplanes
  this.setSize(
    settings.w || 640,
    settings.h || 480
  );
};

Kane.Camera.prototype = Object.create(CameraInterface);

Kane.Camera.prototype.update = function (dT) {
  this.x = Kane.Utils.updatePosition(dT, this.dx, this.x);
  this.y = Kane.Utils.updatePosition(dT, this.dy, this.y);

  this.dx = Kane.Utils.updateVelocity(dT, this.ddx, this.dx);
  this.dy = Kane.Utils.updateVelocity(dT, this.ddy, this.dy);
};

Kane.Camera.prototype.draw = function () {
  //TODO: implement draw bg, drawmap

  if (this.scene.entityManager && this.gameBoard) {
    drawEntities.call(this);
  }
};

function drawEntities () {
  //local ref to ents in entityManager
  var ents = this.scene.entityManager.listEntities()
    , checkCollision = Kane.Utils.checkBBCollision
    , entsToDraw;

  //clear the canvas each draw cycle
  this.gameBoard.clearAll();

  //loop over all entities and check if they "collide" w/ the camera
  //which means they should be drawn 
  entsToDraw = _(ents).filter(function (ent) {
    return checkCollision(ent, this);
  }, this);
  
  //if they should be drawn, calculate where they should be drawn
  //subtract their position in the world from the camera's
  _(entsToDraw).each(function (ent, index, ents) {
    
    if (ent.currentSprite) {
      this.gameBoard.drawSprite(
        ent.currentSprite,
        ent.x - this.y,
        ent.y - this.y,
        ent.w,
        ent.h
      );
    } else {
      this.gameBoard.drawRect(
        ent.color,
        ent.x - this.x,
        ent.y - this.y,
        ent.w,
        ent.h 
      ); 
    }
  }, this);
};

Kane.Camera.prototype.setSize = function (w, h) {
  this.w = w;
  this.h = h;

  //set gameBoard size as well
  this.gameBoard.setSize(w, h);
};

});

minispade.register('clock.js', function() {
"use strict";

minispade.require('kane.js');

var ClockInterface = {
  start: function () {},
  stop: function () {},
  getTimeDelta: function () {},

  //public interface attributes
  isRecording: false,
  startTime: null,
  stopTime: null,
};

Kane.Clock = function () {
  this.timeStamp= null;
  this.startTime = null;
  this.stopTime = null;
  this.isRecording = false;
};

Kane.Clock.prototype = Object.create(ClockInterface);

Kane.Clock.prototype.start = function () {
  var timeStamp = Date.now();
  
  //set the start time
  this.startTime = timeStamp;

  //set the current timeStamp
  this.timeStamp = timeStamp;

  //set recording to true
  this.isRecording = true;
  
  return timeStamp; 
};

Kane.Clock.prototype.stop = function () {
  //reset the timeStamp
  this.timeStamp= null;
  
  //record stopTime
  this.stopTime = Date.now();
    
  this.isRecording = false;

  return this.stopTime;
};

Kane.Clock.prototype.getTimeDelta = function () {
  var timeStamp = Date.now()
    , dT = timeStamp - this.timeStamp;

  if (!this.isRecording) { 
    throw new Error('clock is not currently running'); 
  }
   
  //update the timeStamp stored value for use in next call
  this.timeStamp = timeStamp;
  
  return dT;
};

});

minispade.register('drawplane.js', function() {
"use strict";

minispade.require('kane.js');

var DrawPlaneInterface = {
  fillAll: function (hexColor) {},
  drawRect: function (color, x, y, w, h) {},
  drawImage: function (image, sx, sy) {},
  drawSprite: function (sprite, x, y, w, h) {},
  clearAll: function () {},
  setSize: function (w, h) {},
  getWidth: function () {},
  getHeight: function () {},
};

Kane.DrawPlane = function (settings) {
  if (!settings.board) { 
    throw new Error('must provide canvas domnode'); 
  }
  
  _.extend(this, settings);

  //set initial size of canvas
  this.setSize(
    settings.w || 640,
    settings.h || 480
  );

  //set the drawing context for the board
  this.ctx = this.board[0].getContext('2d');
};

Kane.DrawPlane.prototype = Object.create(DrawPlaneInterface);

//this method will fill the entire board with a solid color
Kane.DrawPlane.prototype.fillAll = function (color) {
  this.drawRect(color, 0, 0, this.board.width, this.board.height);
};

//draw rect w/ provided location/dimesions
Kane.DrawPlane.prototype.drawRect = function (color, x, y, w, h) {
  if (!Kane.Utils.validateColor(color)) { 
    throw new TypeError('invalid color'); 
  }
  //color must be valid hex
  this.ctx.fillStyle = color;
  this.ctx.fillRect(
    Math.round(x), 
    Math.round(y), 
    w, 
    h
  );
};

Kane.DrawPlane.prototype.drawImage = function (image, x, y) {
  var isValidImage = image instanceof Image;

  if (!isValidImage) { 
    throw new Error('not a valid image!'); 
  }

  this.ctx.drawImage(
    image, 
    Math.round(x), 
    Math.round(y)
  );
};

Kane.DrawPlane.prototype.drawSprite = function (sprite, x, y, w, h) {
  var isValidImage = sprite.image instanceof Image;

  if (!isValidImage) { 
    throw new Error('sprite.spriteSheet is not a valid image!'); 
  }

  this.ctx.drawImage(
    sprite.image,
    sprite.sx,
    sprite.sy,
    sprite.w,
    sprite.h,
    Math.round(x),
    Math.round(y),
    w,
    h
  );
};

Kane.DrawPlane.prototype.clearAll = function () {
  this.ctx.clearRect(
    0, 
    0, 
    this.board.attr('width'), 
    this.board.attr('height')
  );
};

Kane.DrawPlane.prototype.setSize = function (w, h) {
  //set size of the canvas element
  this.board.attr({
    width: w || 640,
    height: h || 480
  }); 
};

Kane.DrawPlane.prototype.getHeight = function () {
  return this.board.attr('height');
};

Kane.DrawPlane.prototype.getWidth = function () {
  return this.board.attr('width');
};

});

minispade.register('engine.js', function() {
"use strict";
/*
ENGINE REQUIRES
*/
//require the high level Kane Object
minispade.require('kane.js');

//utility functions
minispade.require('utils.js');

//"utility objects"
minispade.require('clock.js');
minispade.require('assetloader.js');
minispade.require('cache.js');

//"types"
minispade.require('sprite.js');
minispade.require('frame.js');
minispade.require('animation.js');

//"dom objects"
minispade.require('inputwizard.js');
minispade.require('drawplane.js');

//"high levl objects"
minispade.require('game.js');
minispade.require('world.js');
minispade.require('camera.js');
minispade.require('scene.js');

//"entity objects"
minispade.require('entitymanager.js');
minispade.require('entity.js');
minispade.require('projectile.js');
minispade.require('particle.js');

});

minispade.register('entity.js', function() {
"use strict";

minispade.require('kane.js');
minispade.require('utils.js');

var EntityInterface = {
  kill: function () {},
  beforeUpdate: function (dT) {},
  update: function (dT) {}, 
  afterUpdate: function (dT) {},
  collide: function (target) {},
  
  /*
  here we expose required properties of entities that are not
  dependencies.  This makes us able to guarantee that these
  properties exist w/o needing explicit getters/setters for each
  */
  doesCollide: true,
  
  id: 0,
  name: "",
  type: "",

  //render order
  zIndex: 0,

  x: 0,
  y: 0,

  //previous positions
  lastx: 0,
  lasty: 0,

  //dimensions
  w: 0,
  h: 0,

  //velocity
  dx: 0,
  dy: 0,

  //accel
  ddx: 0,
  ddy: 0,
};

Kane.Entity = function (settings) {
  
  //defaults
  this.isDead = false;
  this.doesCollide = true;
  
  this.id = 0;
  this.name = "";
  this.type = "";
  
  this.zIndex = 0;
  
  this.x = 0;
  this.y = 0;
  
  this.lastx = 0;
  this.lasty = 0;

  this.w = 0;
  this.h = 0;

  this.dx = 0;
  this.dy = 0;

  this.ddx = 0;
  this.ddy = 0;

  _.extend(this, settings);
};

Kane.Entity.prototype = Object.create(EntityInterface);

Kane.Entity.prototype.kill = function () {
  this.isDead = true;
};

Kane.Entity.prototype.beforeUpdate = function (dT) {};

Kane.Entity.prototype.update = function (dT) {
  if (undefined == dT) { 
    throw new Error('delta time not provided'); 
  }
  
  //call our beforeUpdate hook to allow custom behavior
  this.beforeUpdate(dT);

  //update positions after checking for 0
  this.x = Kane.Utils.updatePosition(dT, this.dx, this.x);
  this.y = Kane.Utils.updatePosition(dT, this.dy, this.y);

  this.dx = Kane.Utils.updateVelocity(dT, this.ddx, this.dx);
  this.dy = Kane.Utils.updateVelocity(dT, this.ddy, this.dy);

  //call our afterUpdate hook to allow custom behavior
  this.afterUpdate(dT);
};

Kane.Entity.prototype.afterUpdate = function (dT) {};

Kane.Entity.prototype.collide = function (target) {
  if (!target) {
    throw new Error('no target provided');
  }
};

});

minispade.register('entitymanager.js', function() {
"use strict";

minispade.require('kane.js');
minispade.require('utils.js');

var EntityManagerInterface = {
  generateUniqueId: function () {},
  spawn: function (constructor, args) {},
  removeDead: function () {},
  sortBy: function (propName, ascending) {},
  updateAll: function (dT) {},
  findCollisions: function () {},
  listEntities: function () {},
  findByType: function (type) {},
  callForAll: function (methodName, args) {},
  applyForAll: function (methodName, argArray) {},
};

Kane.EntityManager = function (settings) {
  _.extend(this, settings);
};

Kane.EntityManager.prototype = new Array;

/*
different than "normal" syntax here is used to specifically state our intention
to add our interface methods onto the prototype we have defined which 
inherits core functionality from Array
*/
_.extend(Kane.EntityManager.prototype, EntityManagerInterface);

/*
define our prototype methods here as per usual
*/

//override this if you wish to declare a method for generating IDs
Kane.EntityManager.prototype.generateUniqueId = function () {
  var id;

  //setup a counter variable to iterate each time this is called
  if (!this.idCounter) {
    this.idCounter = 0;
  }
  
  //capture this id value
  id = this.idCounter;
  
  //iterate the idCounter var to preserver uniqueness
  this.idCounter++;

  //return the id
  return id;
};

//create new entity and return it
Kane.EntityManager.prototype.spawn = function (constructor, args) {
  if (!constructor) { 
    throw new Error('no constructor provided'); 
  }

  //add reference to manager into args so that entity can see its manager
  args.manager = this;

  var entity = new constructor(args);

  //each entity has a unique id
  entity.id = this.generateUniqueId();

  //push the new entity onto the manager using array method
  this.push(entity); 

  //return the newly created entity
  return entity;
};

//loop over all entities, removing dead ones and then return them
Kane.EntityManager.prototype.removeDead = function () {
  var deadEnts = []; 

  for (var i=0, len=this.length; i<len; i++) {
    if (this[i].isDead) {
      //push this onto the array of deadEnts to return
      deadEnts.push(this[i]);
      //remove from "this"
      this.splice(i--, 1); 
      //shrink the length variable
      len--;
    }
  }
  return deadEnts;
};

//sort this by specified propName (optional ascending boolean)
Kane.EntityManager.prototype.sortBy = function (propName, ascending) {
  if (!propName) {
    throw new Error('must provide numerical propertyName to sort by'); 
  }

  //this insane sorting syntax is courtesy of javascript...
  this.sort(function (a, b) {
    if (ascending) {
      return (a[propName] | 0) - (b[propName] | 0);
    } else {
      return (b[propName] | 0) - (a[propName] | 0);
    }
  });
};

Kane.EntityManager.prototype.updateAll = function (dT) {
  var collisions;

  this.callForAll('update', dT);

  //send out notification of collisions
  collisions = this.findCollisions();
  _(collisions).each(function (collision) {
    collision.subject.collide.call(collision.subject, collision.target);
  }); 
};

Kane.EntityManager.prototype.findCollisions = function () {
  var collisions = []
    , checkCollision = Kane.Utils.checkBBCollision;

  function doesCollide (ent) {
    return ent.doesCollide;
  };

  //iterate through all colliding entities
  _(this).filter(doesCollide).each(function (subjectEnt, index, entities) {

    //compare subjectEnt to all entities (discarding self)
    _(entities).each(function (targetEnt) {

      //perform collision detection here       
      if (checkCollision(subjectEnt, targetEnt)) {

        //if a collision is detected, push this object onto collisions array
        collisions.push({
          subject: subjectEnt, 
          target: targetEnt
        });
      }      
    });
  });

  return collisions; 
};

Kane.EntityManager.prototype.listEntities = function () {
  return this;
};

Kane.EntityManager.prototype.findByType = function (type) {
  if (!type) { 
    throw new Error('no type provided'); 
  }

  return _(this).filter(function (ent) {
    return (type === ent.type);
  });
};

Kane.EntityManager.prototype.findByName = function (name) {
  if (!name) { 
    throw new Error('no name provided'); 
  }

  return _(this).filter(function (ent) {
    return (name === ent.name);
  });
};

/*
additional arguments may be passed when calling this.
they will be passed to each object
*/
Kane.EntityManager.prototype.callForAll = function (methodName) {
  var args = Array.prototype.slice.call(arguments, 1);

  if (!methodName) { 
    throw new Error('no methodName provided'); 
  }

  _(this).each(function (entity) {
    if (entity[methodName]) {
      entity[methodName].apply(entity, args);
    }
  });
};

Kane.EntityManager.prototype.applyForAll = function (methodName, argsArray) {
  if (!methodName) { 
    throw new Error('no methodName provided'); 
  }

  
  _(this).each(function (entity) {
    if (entity[methodName]) {
      entity[methodName].apply(entity, argsArray);
    }
  });
};

});

minispade.register('frame.js', function() {
"use strict";
var FrameInterface = {};

Kane.Frame = function (settings) {
  var error;

  if (undefined === settings.x) { error = "no x provided"; }
  if (undefined === settings.y) { error = "no y provided"; }
  if (undefined === settings.w) { error = "no w provided"; }
  if (undefined === settings.h) { error = "no h provided"; }
  if (error) { throw new Error(error); }

  _.extend(this, settings);
};

Kane.Frame.prototype = Object.create(FrameInterface);


});

minispade.register('game.js', function() {
"use strict";

minispade.require('engine.js');

var GameInterface = {
  getCurrentScene: function () {},
  setCurrentScene: function (name) {},
  start: function () {},
  stop: function () {},

  //required public api attribtues
  isRunning: false,
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
  needed objects.  
  This includes things like cameras, entitymanager, etc
  See Kane.Scene.init for details.
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

});

minispade.register('game/bullet.js', function() {
"use strict";
/*
Bullets are fired by towers
*/
minispade.require('entity.js');

Test.Bullet = function (settings) {
  Kane.Entity.call(this, settings);

  var cache = this.manager.cache
    , image = cache.getByName('spritesheet.png')
    , data = cache.getByName('spritesheet.json')
             .frames['grapebullet.png']
             .frame;

  //bullets die after this much time has elapsed
  this.killTimer = 1500;
  this.spawnTime = Date.now();

  //set height and width based on data
  this.h = data.h;
  this.w = data.w;
  
  this.ddy = .001;

  //set type
  this.type = 'bullet';

  //fallback color
  this.color = "#b0b0b0";
  //sprite
  this.currentSprite = new Kane.Sprite({
    image: image,
    sx: data.x,
    sy: data.y,
    h: data.h,
    w: data.w,
  });
};

Test.Bullet.prototype = Object.create(Kane.Entity.prototype);

Test.Bullet.prototype.beforeUpdate = function (dT) {
  if (this.spawnTime + this.killTimer < Date.now()) {
    this.kill();
  }
};

Test.Bullet.prototype.afterUpdate = function (dT) {
  for (var i=0; i<5; i++) {
    this.manager.spawn(
      Kane.Particle,
      {
        x: this.x,
        y: this.y + Math.round(Math.random() * this.h),
        dx: Math.random() * -this.dx,
        dy: Math.random() * -this.dy,
        lifespan: 100,
        color: '#dd0000', 
        h: 2 + Math.round(Math.random() *4),
        w: 2 + Math.round(Math.random() * 4) 
      }
    );
  }
};

Test.Bullet.prototype.collide = function (target) {
  if ('player' === target.type) {
    this.kill();
    for (var i=0; i<20; i++) {
      //roll for positive or negative y direction
      var ySign = Math.random() > .5 ? -1 : 1;

      this.manager.spawn(
        Kane.Particle,
        {
          x: this.x + target.w / 2,
          y: this.y + target.h / 2,
          dx: Math.random() * this.dx,
          dy: ySign * Math.random() * this.dy,
          lifespan: 400,
          color: "#ee00ee", 
          h: 4,
          w: 4 
        }
      );
    }
  }
};

});

minispade.register('game/index.js', function() {
"use strict";

minispade.require('scene.js');

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
  this.targetSceneName = "ingame";
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

});

minispade.register('game/ingame.js', function() {
"use strict";

minispade.require('scene.js');
minispade.require('game/player.js');
minispade.require('game/tower.js');
minispade.require('game/bullet.js');

//define our 'ingame scene'
Test.Ingame = function (settings) {
  Kane.Scene.call(this, settings);
};

//again, we set the prototype to Kane.Scene's prototype
Test.Ingame.prototype = Object.create(Kane.Scene.prototype);

Test.Ingame.prototype.init = function (settings) {
  //setup an entityManager
  this.entityManager = new Kane.EntityManager({
    cache: this.cache
  });  
  this.gameBoard = new Kane.DrawPlane({
    board: $('#gameboard')
  });
  this.camera = new Kane.Camera({
    scene: this,
    gameBoard: this.gameBoard,
    h: document.height,
    w: document.width
  }); 
};

//Configure our hotkeys!
Test.Ingame.prototype.keydown = function (keyName) {
  var p = this.entityManager.player
    , speed = p.moveSpeed;

  switch (keyName) {
    case "left":
      p.dx = -speed;
      break;
    case "right":
      p.dx = speed;
      break;
    case "up":
      p.dy = -speed;
      break;
    case "down":
      p.dy = speed;
      break;
  }
};

//TODO: This must get fixed as this style of checking for event order is
//extremely hacky and brittle ...and bad
Test.Ingame.prototype.keyup = function (keyName) {
  var p = this.entityManager.player
    , speed = p.moveSpeed;

  switch (keyName) {
    case "left":
      p.dx = 0;
      break;
    case "right":
      p.dx = 0;
      break;
    case "up":
      p.dy = 0;
      break;
    case "down":
      p.dy = 0;
      break;
  }
};

Test.Ingame.prototype.onEnter = function () {
  console.log('game entered!');

  this.entityManager.player = 
    this.entityManager.spawn(
    Test.Player, 
    {
      x: 900,
      y: 100,
    }
  );

  for (var tcount = 0; tcount < 6; tcount++) {
    this.entityManager.spawn(
      Test.Tower, 
      {
        x: 100 + Math.random() * 100,
        y: 50 + tcount * 80,
      }
    );
  }
};

Test.Ingame.prototype.onExit = function () {
  //remove the player, towers, and bullets
  this.entityManager.findByType('player').kill(); 
  this.entityManager.findByType('tower').kill();
  this.entityManager.findByType('bullet').kill();
};

Test.Ingame.prototype.update = function (dT) {
  if (!dT) { 
    throw new Error('no dT provided to update'); 
  }

  this.entityManager.removeDead();
  this.entityManager.sortBy('zIndex'); 
  this.entityManager.updateAll(dT);  
  this.onUpdate(dT);
};

Test.Ingame.prototype.draw = function () {
  this.camera.draw();
  this.onDraw();
};

Test.Ingame.onUpdate = function (dT) {
  
};

});

minispade.register('game/main.js', function() {
"use strict";
/*
define a namespace
this object will hold EVERYTHING in your app
window.MyNameSpace = {};
*/

/*
first, require externally defined objects and the engine
minispade.require('engine.js');
minispade.require('ingameScene.js');
*/

/*
define a game object
this object will require a object of scenenames as strings
these strings must match be camelcase versions of objects
defined on your namespace object
E.G.
MyNameSpace.TestScene should be "testScene"
the game object optionally takes:  
cache object
loader object
clock object
inputWizard object

if not provided to constructor, they will be created for
you using Kane.X objects

E.G

MyNameSpace.game = new Kane.Game({
  namespace: MyNameSpace,
  scenes: ['Index', 'Ingame']
});
*/

window.Test = {};
minispade.require('engine.js');
minispade.require('game/index.js');
minispade.require('game/ingame.js');

Test.game = new Kane.Game({
  namespace: Test,
  sceneNames: ['Index', 'Ingame']
});

Test.game.start();

});

minispade.register('game/player.js', function() {
"use strict";
/*
One player object is created when the scene is entered
The player respawns to input from keyboard and mouse
*/
minispade.require('entity.js');

Test.Player = function (settings) {
  Kane.Entity.call(this, settings);

  var cache = this.manager.cache
    , image = cache.getByName('spritesheet.png')
    , data = cache.getByName('spritesheet.json')
             .frames['banana-antidude.png']
             .frame;

  //set height and width based on data
  this.h = data.h;
  this.w = data.w;
  
  //set type
  this.type = 'player';
  
  //set moveSpeed
  this.moveSpeed = .3;

  //fallback color
  this.color = "#bbbbbb";
  //sprite
  this.currentSprite = new Kane.Sprite({
    image: image,
    sx: data.x,
    sy: data.y,
    h: data.h,
    w: data.w
  });
};

Test.Player.prototype = Object.create(Kane.Entity.prototype);

});

minispade.register('game/stream.js', function() {
"use strict";
Test.Stream = function (settings) {
  Kane.Particle.call(this, settings);
};

Test.Stream.prototype = Object.create(Kane.Particle.prototype);

Test.Stream.prototype.collide = function (target) {
  if ('player' === target.type) {
    this.kill();
    for (var i=0; i<30; i++) {
      this.manager.spawn(
        Kane.Particle,
        {
          x: this.x,
          y: this.y,
          dx: -this.dx / 2 * Math.random(),
          dy: -.25 * Math.random(),
          color: "#bbbb00",
          h: 2,
          w: 2,
          ddy: .001,
          doesCollide: false
        } 
      );
    }
  }
};

});

minispade.register('game/tower.js', function() {
"use strict";
/*
Towers are entities that never move but will
shoot projectiles at the player every so often
*/
minispade.require('entity.js');
minispade.require('particle.js');

Test.Tower = function (settings) {
  Kane.Entity.call(this, settings);

  var cache = this.manager.cache
    , image = cache.getByName('spritesheet.png')
    , data = cache.getByName('spritesheet.json')
             .frames['grapetower.png']
             .frame;

  //fallback color
  this.color = "#123654";
  this.currentSprite = new Kane.Sprite({
    image: image,
    sx: data.x,
    sy: data.y,
    h: data.h,
    w: data.w
  });

  //set height and width based on data
  this.h = data.h;
  this.w = data.w;

  //set type
  this.type = 'tower';

  //for the time being, towers do not collide
  this.doesCollide = false;

  //time between shots
  this.shotTimer = 200;
  this.lastShot = 0; 
  this.bulletSpeed = 1;
};

Test.Tower.prototype = Object.create(Kane.Entity.prototype);

//our tower will check if it should shoot
Test.Tower.prototype.beforeUpdate = function (dT) {
  var currentTime = Date.now();

  if (!this.target) {
    this.target = getTarget(this);
  } 

  if (currentTime > this.lastShot+this.shotTimer) {
    var trajectory = findTrajectory(this, this.target);

    //set lastShot time to now
    this.lastShot = currentTime;
     
    //fire a bullet
    fireBullet(this, trajectory);
    
    //vary the shotTimer
    this.shotTimer = generateShotTimer(this);
  }
};

//return object w/ x/y
function findTrajectory (tower, target) {
  var xComp = target.x - tower.x
    , yComp = target.y - Math.random() * 200 - tower.y
    //TODO: this could be optimized
    length = Math.sqrt(xComp*xComp + yComp*yComp); 

  //return normalized trajectory
  return {
    x: xComp/length,
    y: yComp/length 
  }; 
};

function fireBullet (tower, trajectory) {
  tower.manager.spawn(
    Test.Bullet,
    {
      x: tower.x + tower.w,
      y: tower.y,
      dx: trajectory.x * tower.bulletSpeed,
      dy: trajectory.y * tower.bulletSpeed
    }
  );
};

function getTarget(tower) {
  return tower.manager.player ? tower.manager.player : null;
};

function generateShotTimer (tower) {
  return 2000 + Math.random() * 100;
};

});

minispade.register('inputwizard.js', function() {
"use strict";

minispade.require('kane.js');

/*
this object is responsible for listening to keyboard events
and passing the information on to its subscribers after some
processing
*/

var InputWizardInterface = {
  stream: null
};

Kane.InputWizard = function (settings) {
  var domNode = settings.domNode ? settings.domNode : $('body')
    , streams = []
    , keyStreams = [];

  _.extend(this, settings);

  /*
  this is the broadcast channel for all events captured by this
  add keyboard event handlers and filter out the keyName
  TODO: add touch event handlers
  */

  function sameKey (prev, cur) {
    return (prev.keyName === cur.keyName && prev.type === cur.type); 
  };

  streams.push(
    domNode.asEventStream('mousemove').map(mapMouse),
    domNode.asEventStream('mousedown').map(mapMouse),
    domNode.asEventStream('mouseup').map(mapMouse)
  );

  //group together the keyboard streams
  keyStreams.push(
    domNode.asEventStream('keyup').filter(filterKey).map(mapKey),
    domNode.asEventStream('keydown').filter(filterKey).map(mapKey)
  );

  //merge keyboard streams and skip the duplicates
  streams.push(Bacon.mergeAll(keyStreams).skipDuplicates(sameKey));

  //merge all input streams from mouse/touch/keyboard onto main stream
  //we skip duplicates so that keys already pressed don't jam up the stream
  this.stream = Bacon.mergeAll(streams);
};

Kane.InputWizard.prototype = Object.create(InputWizardInterface);

function filterKey (e) {
  return keyboardMapping[e.keyCode];
};

function mapKey (e) {
  return {
    type: e.type,
    keyName: keyboardMapping[e.keyCode]
  };
};

function mapMouse (e) {
  var position = {
    x: e.offsetX,
    y: e.offsetY
  };
  return {
    type: e.type,
    position: position
  };
};

var keyboardMapping = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  45: "insert",
  46: "delete",
  8: "backspace",
  9: "tab",
  13: "enter",
  16: "shift",
  17: "ctrl",
  18: "alt",
  19: "pause",
  20: "capslock",
  27: "escape",
  32: "space",
  33: "pageup",
  34: "pagedown",
  35: "end",

  48: "0",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  
  65: "a",
  66: "b",
  67: "c",
  68: "d",
  69: "e",
  70: "f",
  71: "g",
  72: "h",
  73: "i",
  74: "j",
  75: "k",
  76: "l",
  77: "m",
  78: "n",
  79: "o",
  80: "p",
  81: "q",
  82: "r",
  83: "s",
  84: "t",
  85: "u",
  86: "v",
  87: "w",
  88: "x",
  89: "y",
  90: "z",

  112: "f1",
  113: "f2",
  114: "f3",
  115: "f4",
  116: "f5",
  117: "f6",
  118: "f7",
  119: "f8",
  120: "f9",
  121: "f10",
  122: "f11",
  123: "f12",

  144: "numlock",
  145: "scrolllock",
  186: "semicolon",
  187: "equal",
  188: "comma",
  189: "dash",
  190: "period",
  191: "slash",
  192: "graveaccent",
  219: "openbracket",
  220: "backslash",
  221: "closebracket",
  222: "singlequote"
};

});

minispade.register('kane.js', function() {
"use strict";
window.Kane = {};

});

minispade.register('particle.js', function() {
"use strict";

minispade.require('entity.js');

//Kane.Particle inherits core behavior from Kane.Entity
Kane.Particle = function (settings) {
  Kane.Entity.call(this, settings);

  //default settings
  this.lifespan = 600;
  this.color = "#1382bb";
  this.h = 5;
  this.w = 5; 

  this.doesCollide = false;

  _.extend(this, settings);
  this.killtimer = Date.now() + this.lifespan;
};

Kane.Particle.prototype = Object.create(Kane.Entity.prototype);

//check kill timer to see if we should kill ourselves
Kane.Particle.prototype.afterUpdate = function (dT) {
  if (Date.now() > this.killtimer) {
    this.kill();
  }
};

});

minispade.register('projectile.js', function() {
"use strict";

minispade.require('entity.js');

//Kane.Projectile inherits core behavior from Kane.Entity
Kane.Projectile = function (settings) {

  Kane.Entity.call(this, settings);

  this.h = 24;
  this.w = 24; 
  this.color = "#00bb22";

  this.lifespan = 2000;
  this.doesCollide = true;

  this.killtimer = Date.now() + this.lifespan;

  _.extend(this, settings);
};

Kane.Projectile.prototype = Object.create(Kane.Entity.prototype);

Kane.Projectile.prototype.afterUpdate = function (dT) {
  if (Date.now() > this.killtimer) {
    this.kill();
  }
};

Kane.Projectile.prototype.collide = function (target) {
  //kill ourselves
  this.kill();

  //spawn "gib" particles
  for (var i=0; i<20; i++) {
    this.manager.spawn(
      Kane.Particle,
      {
        x: this.x,
        y: this.y,
        dx: Math.random() * (this.dx + target.dx),
        dy: Math.random() * (this.dy + target.dy),
        w: 4,
        h: 4,
        ddy: .001,
      }
    );
  }
};

});

minispade.register('scene.js', function() {
"use strict";

minispade.require('kane.js');

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
        this.keydown.call(this, val.keyName);
        break;
      case 'keyup':
        this.keyup.call(this, val.keyName);
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

});

minispade.register('sprite.js', function() {
"use strict";

minispade.require('kane.js');

var SpriteInterface = {};

Kane.Sprite = function (settings) {
  var validImage = settings.image instanceof Image;

  this.x = 0;
  this.y = 0;
  this.w = 0;
  this.h = 0;

  if (!validImage) {
    throw new Error('no valid image provided to constructor!');
  };

  _.extend(this, settings);
};

Kane.Sprite.prototype = Object.create(SpriteInterface);

});

minispade.register('utils.js', function() {
"use strict";

minispade.require('kane.js');

Kane.Utils = {
  camel: function (name) {
    var firstChar = name.charAt(0);

    return name.replace(firstChar, firstChar.toLowerCase());
  },
  generateColor: function () {
    return "#" + Math.random().toString(16).slice(2, 8);
  },

  validateColor: function (color) {
    var validColor = /^#[0-9a-f]{3}$|[0-9a-f]{6}$/i;

    return validColor.test(color);
  },

  stripExtension: function (name) {
    return name.slice(0, name.indexOf('.'));
  },

  stripFilePath: function (path) {
    return path.slice(path.lastIndexOf('/') + 1);
  },

  updatePosition: function (dT, v, oldPos) {
    return oldPos + dT * v; 
  },

  updateVelocity: function (dT, a, oldVel) {
    return oldVel + dT * a; 
  },

  checkBBCollision: function (sub, tar) {
    //don't collide with self
    if (sub === tar) { 
      return false; 
    }

    /*
    to clearly visualize this visit
    silentmatt.com/rectangle-intersection/
    */ 
    return ( (sub.x < (tar.x + tar.w)) && 
             ((sub.x + sub.w) > tar.x) &&
             (sub.y < (tar.y + tar.h)) &&
             ((sub.y + sub.h) > tar.y) 
    );
  },
  createCanvas: function (w, h, name) {
    var $canvas = $(document.createElement('canvas'));
    
    $canvas.attr({
      id: name,
      height: h,
      width: w
    }); 
    $('body').append($canvas);
    return $canvas;
  } 
}

});

minispade.register('world.js', function() {
"use strict";

minispade.require('kane.js');

var WorldInterface = {
  loadData: function(data) {},

  //public facing interface attributes
  isLoaded: false,
};

Kane.World = function (settings) {
  //bus transmits world events
  if (!settings.bus) {
    throw new Error('no bus provided in settings to constructor');
  }

  _.extend(this, settings);

  this.isLoaded = false;
};

Kane.World.prototype = Object.create(WorldInterface);

Kane.World.prototype.loadData = function (data) {
  if (!data) {
    throw new Error('no data provided to load!');
  }

  this.data = data; 
  
  this.isLoaded = true;
};

});
