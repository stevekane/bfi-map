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
  drawBg: function () {},
  drawEntities: function () {},
  drawWorld: function () {},
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

Cameras must also be instantiated with a planes object that must
contain at least one Kane.DrawPlane instance 

the camera MUST be attached to a scene before it is made active
*/
Kane.Camera = function (settings) {
  if (!settings.planes) {
    throw new Error('no planes object provided to constructor');
  }

  if (0 === _.keys(settings.planes).length) {
    throw new Error('no planes provided to constructor'); 
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
  if (this.scene.bgImage && this.planes.bgPlane) {
    this.drawBg();
  } 
  if (this.scene.world && this.planes.worldPlane) {
    this.drawWorld();
  } 
  if (this.scene.entityManager && this.planes.entityPlane) {
    this.drawEntities();
  } 
};

Kane.Camera.prototype.drawBg = function () {
  this.planes.bgPlane.clearAll();
  this.planes.bgPlane.drawImage(this.scene.bgImage, 0, 0);
};

Kane.Camera.prototype.drawWorld = function () {

};

Kane.Camera.prototype.drawEntities = function () {
  //local ref to ents in entityManager
  var ents = this.scene.entityManager.listEntities()
    , checkCollision = Kane.Utils.checkBBCollision
    , entsToDraw;

  //clear the canvas each draw cycle
  this.planes.entityPlane.clearAll();

  //loop over all entities and check if they "collide" w/ the camera
  //which means they should be drawn 
  entsToDraw = _(ents).filter(function (ent) {
    return checkCollision(ent, this);
  }, this);
  
  //if they should be drawn, calculate where they should be drawn
  //subtract their position in the world from the camera's
  _(entsToDraw).each(function (ent, index, ents) {
    if (ent.currentSprite) {
      this.planes.entityPlane.drawSprite(
        ent.currentSprite,
        ent.x - this.y,
        ent.y - this.y,
        ent.w,
        ent.h
      );
    } else {
      this.planes.entityPlane.drawRect(
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

  //set the size of all the planes this camera controls
  _.each(this.planes, function (plane) {
    plane.setSize(w, h);
  }); 
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
//require the high level Kane.Object
minispade.require('kane.js');

//utility functions
minispade.require('utils.js');

//"utility objects"
minispade.require('clock.js');
minispade.require('assetloader.js');
minispade.require('loader.js');
minispade.require('jsonloader.js');
minispade.require('imageloader.js');
minispade.require('cache.js');

//"types"
minispade.require('sprite.js');

//"dom objects"
minispade.require('inputwizard.js');
minispade.require('drawplane.js');

//"high levl objects"
minispade.require('game.js');
minispade.require('world.js');
minispade.require('camera.js');
minispade.require('scene.js');
minispade.require('loadingscene.js');
minispade.require('gamescene.js');

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

//requires array of entities
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

  var entity = new constructor(args);

  //entity has reference to its manager
  entity.manager = this;

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

minispade.register('game.js', function() {
"use strict";

minispade.require('kane.js');

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

minispade.register('game/main.js', function() {
"use strict";

minispade.require('engine.js');

function createCanvas (w, h, name) {
  var $canvas = $(document.createElement('canvas'));
  
  $canvas.attr({
    id: name,
    height: h,
    width: w
  }); 
  
  $('body').append($canvas);

  return $canvas;
};

//input wizard configuration
//we will add our subscriber from the scene instance
var inputWizard = new Kane.InputWizard({});

/*
Construction of specific scene
setup entity set for this scene
*/
var entityCanvas = createCanvas(300, 300, 'entities')
  , entityPlane = new Kane.DrawPlane({board: entityCanvas})
  , bgCanvas = createCanvas(300, 300, 'gameboard')
  , bgPlane = new Kane.DrawPlane({board: bgCanvas})
  , entityManager = new Kane.EntityManager({drawplane: entityPlane})
  , cache = new Kane.Cache()
  , loader = new Kane.AssetLoader({cache: cache});

//define camera for our ingameScene
var camera = new Kane.Camera({
  scene: ingame,
  planes: {
    entityPlane: entityPlane,
    bgPlane: bgPlane,
  },
  h: 540,
  w: 1000 
});

/*
pass in our inputWizard and our entityManager
we also pass it a reference to our image/json cache
incase we wish to pull objects from them
*/
var ingame = new Kane.GameScene({
  name: 'ingame',
  entityManager: entityManager,
  cache: cache,
  loader: loader,
  camera: camera
});

/*
ALL BACON ACTIVITY USES DOM ELEMENTS DEFINED IN THE HTML DOC
THIS IS JUST TEMPORARY AND CAUSES TESTS TO FAIL
*/
//BACON STATS SETUP
ingame.entityManager.baconLength = new Bacon.Bus();
ingame.entityManager.baconCollisions = new Bacon.Bus();

//Assign bacon stat streams to behaviors that render in the DOM
var entCount = document.getElementById('entityCount')
  , colCount = document.getElementById('collisionCount');

entityManager.baconLength.onValue(function (val) {
  entCount.textContent = val;  
});

entityManager.baconCollisions.onValue(function (val) {
  colCount.textContent = colCount.textContent ? 
                         parseInt(colCount.textContent) + val : 
                         val;
});

//define onEnter/onExit hook to log
ingame.onEnter = function () {
  console.log('ingame entered!');
};

ingame.onExit = function () {
  console.log('ingame exited!');
};

//define a timer to fire new objects (ms)
ingame.shotTimer = 60;

ingame.onUpdate = function (dT) {
  var emLen = this.entityManager.length
    , collisions = this.entityManager.findCollisions();

  this.entityManager.baconLength.push(emLen);
  this.entityManager.baconCollisions.push(collisions.length);

  if (!this.lastShotFired) {
    this.lastShotFired = Date.now();
  } else {
    if ((this.lastShotFired + this.shotTimer) < Date.now()) {
      this.fire(0, 400, Math.random(), -1 * Math.random());
      this.fire(640, 400, -1 * Math.random(), -1 * Math.random());
      this.fire(800, 100, -1 * Math.random(), -.2 * Math.random());
      this.fire(200, 100, Math.random(), -.2 * Math.random());
      this.lastShotFired = Date.now();
    }
  }
};

//DEFINE utility method that fires projectiles
ingame.fire = function (x, y, dx, dy) {
  var spriteSheet = this.cache.getByName('spritesheet.png')
    , json = this.cache.getByName('spritesheet.json')
    , data = json.frames['grapebullet.png'].frame
    , sprite = new Kane.Sprite({
        image: spriteSheet,
        sx: data.x,
        sy: data.y,
        w: data.w,
        h: data.h
    });

  this.entityManager.spawn(
    Kane.Projectile,
    {
      currentSprite: sprite,
      x: x,
      y: y,
      dx: dx,
      dy: dy,
      ddy: .001,
      h: 30,
      w: 30,
    }
  );
};

/*
this is a loading scene.  It will load assets into the provided
caches using the provided loaders and then advance to ingame
*/

var index = new Kane.LoadingScene({
  name: 'index',
  targetSceneName: 'ingame',
  cache: cache,
  loader: loader,
  assets: ['public/images/spritesheet.png',
           'public/json/spritesheet.json']
});

var clock = new Kane.Clock()
  , game = new Kane.Game({
      clock: clock,
      scenes: {
        index: index,
        ingame: ingame
      },
  });

game.start();

});

minispade.register('game/oldmain.js', function() {
"use strict";

minispade.require('engine.js');

function createCanvas (w, h, name) {
  var $canvas = $(document.createElement('canvas'));
  
  $canvas.attr({
    id: name,
    height: h,
    width: w
  }); 
  
  $('body').append($canvas);

  return $canvas;
};

//input wizard configuration
//we will add our subscriber from the scene instance
var inputWizard = new Kane.InputWizard({});

//setup image loader/cache/bus.  optionally we inject the bus onto 
//the cache to be more explicit about its dependencies
var imageBus = new Bacon.Bus();
var imageCache = new Kane.Cache({
  bus: imageBus 
});
var imageLoader = new Kane.ImageLoader({
  cache: imageCache,
  bus: imageBus 
});

//let's make our cache 'listen' to our loader's bus
imageCache.bus.onValue( function (object) {
  this.cache(object.name, object.asset);
}.bind(imageCache));

//let's add another bus listener to log the loading 
imageCache.bus.onValue( function (object) {
  console.log(object.name, ' has been loaded successfully!');
});

//setup json loader/cache/bus.  optionally we inject the bus onto
//this cache to be more explicit about its dependencies
var jsonBus = new Bacon.Bus();
var jsonCache = new Kane.Cache({
  bus: jsonBus 
});
var jsonLoader = new Kane.JSONLoader({
  cache: jsonCache,
  bus:jsonBus 
});

//let's make our cache 'listen' to our loader's bus
jsonCache.bus.onValue( function (object) {
  this.cache(object.name, object.asset);
}.bind(jsonCache));

//let's add another bus listener to log the loading
jsonCache.bus.onValue( function (object) {
  console.log(object.name, ' has been loaded successfully!');
});

/*
Construction of specific scene
setup entity set for this scene
*/
var entityCanvas = createCanvas(300, 300, 'entities')
  , entityPlane = new Kane.DrawPlane({board: entityCanvas})
  , bgCanvas = createCanvas(300, 300, 'gameboard')
  , bgPlane = new Kane.DrawPlane({board: bgCanvas})
  , entityManager = new Kane.EntityManager({drawplane: entityPlane});

//define camera for our ingameScene
var camera = new Kane.Camera({
  scene: ingame,
  planes: {
    entityPlane: entityPlane,
    bgPlane: bgPlane,
  },
  h: 540,
  w: 1000 
});

/*
pass in our inputWizard and our entityManager
we also pass it a reference to our image/json cache
incase we wish to pull objects from them
*/
var ingame = new Kane.GameScene({
  name: 'ingame',
  inputWizard: inputWizard, 
  entityManager: entityManager,
  imageCache: imageCache,
  jsonCache: jsonCache,
  camera: camera
});

/*
ALL BACON ACTIVITY USES DOM ELEMENTS DEFINED IN THE HTML DOC
THIS IS JUST TEMPORARY AND CAUSES TESTS TO FAIL
*/
//BACON STATS SETUP
ingame.entityManager.baconLength = new Bacon.Bus();
ingame.entityManager.baconCollisions = new Bacon.Bus();

//Assign bacon stat streams to behaviors that render in the DOM
var entCount = document.getElementById('entityCount')
  , colCount = document.getElementById('collisionCount');

entityManager.baconLength.onValue(function (val) {
  entCount.textContent = val;  
});

entityManager.baconCollisions.onValue(function (val) {
  colCount.textContent = colCount.textContent ? 
                         parseInt(colCount.textContent) + val : 
                         val;
});

//define onEnter/onExit hook to log
ingame.onEnter = function () {
  console.log('ingame entered!');
};

ingame.onExit = function () {
  console.log('ingame exited!');
};

//define a timer to fire new objects (ms)
ingame.shotTimer = 60;

ingame.onUpdate = function (dT) {
  var emLen = this.entityManager.length
    , collisions = this.entityManager.findCollisions();

  this.entityManager.baconLength.push(emLen);
  this.entityManager.baconCollisions.push(collisions.length);

  if (!this.lastShotFired) {
    this.lastShotFired = Date.now();
  } else {
    if ((this.lastShotFired + this.shotTimer) < Date.now()) {
      this.fire(0, 400, Math.random(), -1 * Math.random());
      this.fire(640, 400, -1 * Math.random(), -1 * Math.random());
      this.lastShotFired = Date.now();
    }
  }
};

//DEFINE utility method
ingame.fire = function (x, y, dx, dy) {
  var spriteSheet = this.imageCache.getByName('public/images/spritesheet')
    , json = this.jsonCache.getByName('public/json/spritesheet')
    , data = json.frames['grapebullet.png'].frame
    , sprite = new Kane.Sprite({
        image: spriteSheet,
        sx: data.x,
        sy: data.y,
        w: data.w,
        h: data.h
    });

  this.entityManager.spawn(
    Kane.Projectile,
    {
      currentSprite: sprite,
      x: x,
      y: y,
      dx: dx,
      dy: dy,
      ddy: .001,
      h: 30,
      w: 30,
    }
  );
};

/*
this is a loading scene.  It will load assets into the provided
caches using the provided loaders and then advance to ingame
*/

var index = new Kane.LoadingScene({
  name: 'index',
  targetSceneName: 'ingame',

  imageLoader: imageLoader,
  imageCache: imageCache,
  imageAssets: ['public/images/spritesheet'],

  jsonLoader: jsonLoader,
  jsonCache: jsonCache,
  jsonAssets: ['public/json/spritesheet'],
});

index.imageLoader.loadAsset('public/images/spritesheet.png');
index.jsonLoader.loadAsset('public/json/spritesheet.json');

var clock = new Kane.Clock()
  , game = new Kane.Game({
      clock: clock,
      scenes: {
        index: index,
        ingame: ingame
      },
  });

game.start();

});

minispade.register('gamescene.js', function() {
"use strict";

minispade.require('scene.js');

Kane.GameScene = function (settings) {
  Kane.Scene.call(this, settings);

  if (!settings.entityManager) {
    throw new Error('no entityManager provided to constructor');
  }

  if (!settings.camera) {
    throw new Error('no camera provided to constructor');
  }

  //inject the scene onto the camera (used to access other scene objects)
  settings.camera.scene = this; 
  
  _.extend(this, settings);
};

Kane.GameScene.prototype = Object.create(Kane.Scene.prototype);

Kane.GameScene.prototype.update = function (dT) {
  if (!dT) { 
    throw new Error('no dT provided to update'); 
  }

  this.entityManager.removeDead();
  this.entityManager.sortBy('zIndex'); 
  this.entityManager.updateAll(dT);  
  this.onUpdate(dT);
};

Kane.GameScene.prototype.draw = function () {
  this.camera.draw();
  this.onDraw();
};

});

minispade.register('imageloader.js', function() {
"use strict";

minispade.require('kane.js');
minispade.require('loader.js');

Kane.ImageLoader = function (settings) {
  Kane.Loader.call(this, settings);

  this.loading = {};
};

Kane.ImageLoader.prototype = Object.create(Kane.Loader.prototype);

Kane.ImageLoader.prototype.loadAsset = function (fileName) {
  var newImage = new Image()
    , name = Kane.Utils.stripExtension(fileName);
  
  if (!fileName) {
    throw new Error('no fileName provided to loadImage');
  }

  //callback defined in scope w/ this new image
  function onLoad () {
    this.broadcast({
      name: name,
      asset: newImage
    });
  }

  function onError () {
    this.handleError({
      name: name,
      asset: newImage
    });
  }

  //setting the src will immediatly trigger a server request
  newImage.onload = onLoad.bind(this);
  newImage.onerror = onError.bind(this);
  newImage.src = fileName;

  this.loading[name] = newImage;
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
    , streams = [];

  _.extend(this, settings);

  /*
  this is the broadcast channel for all events captured by this
  add keyboard event handlers and filter out the keyName
  TODO: add touch event handlers
  */
  streams.push(
    domNode.asEventStream('keyup').filter(filterKey).map(mapKey),
    domNode.asEventStream('keydown').filter(filterKey).map(mapKey),
    domNode.asEventStream('mousemove').map(mapMouse),
    domNode.asEventStream('mousedown').map(mapMouse),
    domNode.asEventStream('mouseup').map(mapMouse)
  );

  //merge all input streams from mouse/touch/keyboard onto main stream
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

minispade.register('jsonloader.js', function() {
"use strict";

minispade.require('kane.js');
minispade.require('loader.js');

//WE EXTEND LOADER

Kane.JSONLoader = function (settings) {
  Kane.Loader.call(this, settings); 
  
  this.loading = {};
};

Kane.JSONLoader.prototype = Object.create(Kane.Loader.prototype);

Kane.JSONLoader.prototype.loadAsset = function (fileName) {
  var name = Kane.Utils.stripExtension(fileName)
    , ajax
    , ajaxStream;

  if (!fileName) {
    throw new Error('no fileName provided to loadImage');
  }

  //assign ajax var to initiate request
  ajax = $.getJSON(fileName);
  //create an event stream from the ajax call
  ajaxStream = Bacon.fromPromise(ajax); 
  //define stream behaviors for success/error
  ajaxStream.onError(function () {
    this.handleError({
      name: name,
      asset: {}
    });
  }.bind(this));

  ajaxStream.onValue(function (json) {
    this.broadcast({
      name: name,
      asset: json 
    });
  }.bind(this));

  //store them as k/v pairs 
  this.loading[name] = {};
};

});

minispade.register('kane.js', function() {
"use strict";
window.Kane = {};

});

minispade.register('loader.js', function() {
"use strict";

minispade.require('kane.js');

var LoaderInterface = {
  loadAsset: function (fileName) {},
  handleError: function (name, image) {},
  broadcast: function (object) {},

  //public interface attributes
  loading: {},
  bus: null
};

Kane.Loader = function (settings) {
  if (!settings.cache) {
    throw new Error('no cache provided in settings');
  }
  if (!settings.bus) {
    throw new Error('no bus provided in settings');
  } 

  _.extend(this, settings);

  this.loading = {}; 
};

Kane.Loader.prototype = Object.create(LoaderInterface);

//this is just mapped out here for ref, you will override
//this if using as a prototype
Kane.Loader.prototype.loadAsset = function (fileName) {
  var name = Kane.Utils.stripExtension(fileName);

  if (!fileName) {
    throw new Error('no fileName provided to loadImage');
  }
  
  this.loading[name] = {};
};

//this is generally called by Image onerror callbacks
Kane.Loader.prototype.handleError = function (object) {
  if (!object.name) {
    throw new Error('no name provided');
  }
  if (!object.asset) {
    throw new Error('no asset provided');
  }

  delete this.loading[object.name];
};

Kane.Loader.prototype.broadcast = function (object) {
  if (!object.name) {
    throw new Error('no name provided'); 
  } 
  if (!object.asset) {
    throw new Error('no asset provided'); 
  } 

  /*
  push this object onto the bus.  Anyone subscribing to this bus
  will see this object and may respond as they desire
  */
  this.bus.push(object);

  //remove this asset from the loading object
  delete this.loading[object.name];
};

});

minispade.register('loadingscene.js', function() {
"use strict";

minispade.require('scene.js');

Kane.LoadingScene = function (settings) {
  Kane.Scene.call(this, settings);

  if (!settings.cache) {
    throw new Error('no cache provided');
  }

  if (!settings.loader) {
    throw new Error('no loader provided');
  }

  if (!settings.targetSceneName) {
    this.targetSceneName = this.name;
  }
};

Kane.LoadingScene.prototype = Object.create(Kane.Scene.prototype);

Kane.LoadingScene.prototype.onEnter = function () {
  console.log('loading assets for ', this.targetSceneName);
  this.loader.loadAssets('ingameAssets', this.assets, loadingComplete.bind(this));
};

Kane.LoadingScene.prototype.onExit = function () {
  console.log('transitioning from ', this.name, ' to', this.targetSceneName);
};

function loadingComplete (errors) {
  if (0 < errors.length) {
    console.log(errors, ' failed to load');
  } else {
    this.game.setCurrentScene(this.targetSceneName);
  }
};

});

minispade.register('particle.js', function() {
"use strict";

minispade.require('entity.js');

//Kane.Particle inherits core behavior from Kane.Entity
Kane.Particle = function (settings) {
  Kane.Entity.call(this, settings);

  //default settings
  this.lifespan = 600;
  this.killtimer = Date.now() + this.lifespan;
  this.color = "#1382bb";
  this.h = 5;
  this.w = 5; 

  this.doesCollide = false;

  _.extend(this, settings);
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
update and draw generally should be left alone.  they both expose hooks
for calling onUpdate and onDraw which may be defined however you desire

onEnter and onExit may be defined to do w/e you desire and they will be called
by the game object that owns this scene on scene transitions 
*/
var SceneInterface = {
  update: function (dT) {},
  draw: function () {},

  keyDown: function (keyName) {},
  keyUp: function (keyName) {},

  onEnter: function () {},
  onExit: function () {},
  onDraw: function () {},
  onUpdate: function (dT) {},

  name: '',
  keyMap: {},
};

/*
note, if the settings provided include a name it will be overwritten
by the provided name 
*/
Kane.Scene = function (settings) {
  if (!settings.name) {
    throw new Error('no name provided in settings hash');
  }

  //set default keyMap
  this.keyMap = {};

  //apply settings object to this scene
  _.extend(this, settings);
};

Kane.Scene.prototype = Object.create(SceneInterface);

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

});

minispade.register('sprite.js', function() {
"use strict";

minispade.require('kane.js');

var SpriteInterface = {

};

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
