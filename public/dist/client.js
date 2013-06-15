minispade.register('cache.js', function() {
"use strict";

minispade.require('kane.js');

var CacheInterface = {
  cache: function (name, item) {},
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

Kane.Cache.prototype.cache = function (object) {
  if (!object.name) {
    throw new Error('no name provided for the object');
  }
  if (!object.asset) {
    throw new Error('no asset provided for the object');
  }
  this.store[object.name] = object.asset; 
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
  drawImage: function (image, sx, sy, sw, sh, x, y, w, h) {},
  clearAll: function () {}
};

Kane.DrawPlane = function (settings) {
  if (!settings.board) { 
    throw new Error('must provide canvas domnode'); 
  }

  _.extend(this, settings);
  this.ctx = this.board.getContext('2d');
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
  this.ctx.fillRect(x, y, w, h);
};

Kane.DrawPlane.prototype.drawImage = function (image, sx, sy) {
  var isValidImage = image instanceof Image;

  if (!isValidImage) { 
    throw new Error('not a valid image!'); 
  }
  this.ctx.drawImage(image, sx, sy);
};

Kane.DrawPlane.prototype.clearAll = function () {
  this.ctx.clearRect(0, 0, this.board.width, this.board.height);
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
minispade.require('loader.js');
minispade.require('jsonloader.js');
minispade.require('imageloader.js');
minispade.require('cache.js');

//"dom objects"
minispade.require('inputwizard.js');
minispade.require('drawplane.js');

//"high levl objects"
minispade.require('game.js');
minispade.require('world.js');
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

var EntityInterface = {
  kill: function () {},
  isDead: function () {},
  beforeUpdate: function (dT) {},
  update: function (dT) {}, 
  afterUpdate: function (dT) {},
  beforeDraw: function () {},
  draw: function () {},
  afterDraw: function () {},
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
  
  this._isDead = false;
  this.doesCollide = true;

  _.extend(this, settings);
};

Kane.Entity.prototype = Object.create(EntityInterface);

Kane.Entity.prototype.kill = function () {
  this._isDead = true;
};

Kane.Entity.prototype.isDead = function () {
  return this._isDead;
};

Kane.Entity.prototype.beforeUpdate = function (dT) {};

Kane.Entity.prototype.update = function (dT) {
  var potentialY;

  if (undefined == dT) { 
    throw new Error('delta time not provided'); 
  }
  
  //call our beforeUpdate hook to allow custom behavior
  this.beforeUpdate(dT);

  //update positions after checking for 0
  this.x = updatePosition(dT, this.dx, this.x);
  this.y = updatePosition(dT, this.dy, this.y);

  this.dx = updateVelocity(dT, this.ddx, this.dx);
  this.dy = updateVelocity(dT, this.ddy, this.dy);

  //call our afterUpdate hook to allow custom behavior
  this.afterUpdate(dT);
};

Kane.Entity.prototype.afterUpdate = function (dT) {};

Kane.Entity.prototype.beforeDraw = function () {};

Kane.Entity.prototype.draw = function () {
  if (!this.image) {
    this.manager.drawplane.drawRect(
      this.color, 
      //x and y are rounded to avoid drawing on fractional pixels
      Math.round(this.x),
      Math.round(this.y), 
      this.w, 
      this.h
    );
  } else {
    //this.drawplane.drawImage
  }
};

Kane.Entity.prototype.afterDraw = function () {};

Kane.Entity.prototype.collide = function (target) {
  if (!target) {
    throw new Error('no target provided');
  }
};

function updatePosition(dT, v, oldPos) {
  return oldPos + dT * v;
};

function updateVelocity(dT, a, oldVel) {
  return oldVel + dT * a;
}; 

});

minispade.register('entitymanager.js', function() {
"use strict";

minispade.require('kane.js');

var EntityManagerInterface = {
  generateUniqueId: function () {},
  spawn: function (constructor, args) {},
  removeDead: function () {},
  sortBy: function (propName, ascending) {},
  updateAll: function (dT) {},
  drawAll: function () {},
  findCollisions: function () {},
  listEntities: function () {},
  findByType: function (type) {},
  callForAll: function (methodName, args) {},
  applyForAll: function (methodName, argArray) {},
  
  //define mandatory interface attribute
  drawplane: {},
};

//requires array of entities
Kane.EntityManager = function (settings) {
  if (!settings.drawplane) { 
    throw new Error('must provide drawplane'); 
  }

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
    if (this[i].isDead()) {
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

Kane.EntityManager.prototype.drawAll = function () {
  //clear the drawplane
  this.drawplane.clearAll();

  //call draw for each entity
  this.callForAll('draw'); 
};

Kane.EntityManager.prototype.findCollisions = function () {
  var collisions = []
    , colliders = [];

  function checkCollision (sub, tar) {
    
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
  };

  function doesCollide (ent) {
    return ent.doesCollide;
  };

  //iterate through all colliding entities
  colliders = _(this).filter(doesCollide); 
  _(colliders).each(function (subjectEnt, index, entities) {

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
  var canvas = document.createElement('canvas');
  
  canvas.id = name;
  canvas.height = h;
  canvas.width = w;
  
  document.body.appendChild(canvas);

  return document.getElementById(name);
};

//global background canvas object
var bgCanvas = createCanvas(640, 480, 'gameboard')
  , bgPlane = new Kane.DrawPlane({board: bgCanvas});

//color background
//bgPlane.fillAll(Kane.Utils.generateColor());

//input wizard configuration
//we will add our subscriber from the scene instance
var inputWizard = new Kane.InputWizard();
inputWizard.attachToDomNode(document.body)
           .activateKeyboardForDomNode(document.body);

//Construction of specific scene
//setup entity set for this scene
var entityCanvas = createCanvas(640, 480, 'entities')
  , entityPlane = new Kane.DrawPlane({board: entityCanvas})
  , entityManager = new Kane.EntityManager({drawplane: entityPlane})
  , clock = new Kane.Clock()
  , game = new Kane.Game({
    clock: clock
  });

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
  this.cache(object);
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
  this.cache(object);
}.bind(jsonCache));

//let's add another bus listener to log the loading
jsonCache.bus.onValue( function (object) {
  console.log(object.name, ' has been loaded successfully!');
});

/*
pass in our inputWizard and our entityManager
we also pass it a reference to our image/json cache
incase we wish to pull objects from them
*/
var ingame = new Kane.Scene({
  name: 'ingame',
  inputWizard: inputWizard, 
  entityManager: entityManager,
  imageCache: imageCache,
  jsonCache: jsonCache,
});

/*
ALL BACON ACTIVITY USES DOM ELEMENTS DEFINED IN THE HTML DOC
THIS IS JUST TEMPORARY AND CAUSES TESTS TO FAIL
*/
//BACON STATS SETUP
ingame.entityManager.baconLength = new Bacon.Bus();
ingame.entityManager.baconCollisions = new Bacon.Bus();

//BACON STAT PUSHING BEHAVIOR
ingame.onUpdate = function (dT) {
  var emLen = this.entityManager.length
    , collisions = this.entityManager.findCollisions();

  this.entityManager.baconLength.push(emLen);
  this.entityManager.baconCollisions.push(collisions.length);
};

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

//define onEnter hook to subscribe to inputWizard
ingame.onEnter = function () {
  var spriteSheet = this.imageCache.getByName('public/images/spritesheet');
  console.log('ingame entered!');
  this.inputWizard.addSubscriber(this);

  bgPlane.drawImage(spriteSheet, 0, 0);
};

//define onExit hook to un-subscribe to inputWizard
ingame.onExit = function () {
  console.log('ingame exited!');
  this.inputWizard.removeSubscriber(this);
};

//hacky mapping of keyname to dx/dy values
ingame.keynameVelocityMapping = {
  left: {
    dx: -1,
    dy: 0 
  },
  right: {
    dx: 1,
    dy: 0 
  },
  up: {
    dx: 0,
    dy: -1
  },
  down: {
    dx: 0,
    dy: 1 
  },
};

//REWRITE USING EXTERNALLY DEFINED ENTITIES
ingame.keyup = function (keyName) {
  var mapping = this.keynameVelocityMapping[keyName];
  
  if (mapping) {
    var dx = mapping.dx * Math.random()
      , dy = mapping.dy * Math.random();

    this.entityManager.spawn(
      Kane.Projectile,
      {
        x: Math.round(Math.random() * 640),
        y: Math.round(Math.random() * 480),
        dx: dx,
        dy: dy,
        ddy: .001,
      }
    );
  }
};

/*
this is a loading scene.  It will load assets into the provided
caches using the provided loaders and then advance to ingame
*/

var loading = new Kane.LoadingScene({
  name: 'loading',
  imageLoader: imageLoader,
  jsonLoader: jsonLoader,
  imageCache: imageCache,
  jsonCache: jsonCache,
  imageAssets: ['public/images/spritesheet'],
  jsonAssets: ['public/json/spritesheet'],
  targetSceneName: 'ingame' 
})

loading.imageLoader.loadAsset('public/images/spritesheet.png');
loading.jsonLoader.loadAsset('public/json/spritesheet.json');

//configure the game object before starting it
game.addScene(ingame);
game.addScene(loading);
game.setCurrentScene('loading');

game.start();

});

minispade.register('gamescene.js', function() {
"use strict";

minispade.require('scene.js');

Kane.GameScene = function (settings) {
  if (!settings.entityManager) {
    throw new Error('no entityManager provided to constructor');
  }

  if(!settings.inputWizard) {
    throw new Error('no inputWizard provided to constructor');
  }

  _.extend(this, settings);

};

Kane.GameScene.prototype = Object.create(Kane.Scene.prototype);


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
  addSubscriber: function (subscriber) {},  
  removeSubscriber: function (subscriber) {},  
  attachToDomNode: function (domNode) {},  
  removeFromDomNode: function (domNode) {},  
  activateKeyboardForDomNode: function (domNode) {},  
  deactivateKeyboardForDomNode: function (domNode) {},  

  //public interface attributes
  subscribers: [],
  domNodes: [],
};

Kane.InputWizard = function (settings) {
  _.extend(this, settings);

  this.subscribers = [];
  this.domNodes = [];

  /*
  we create instances of these functions that have a bound 
  "this" value in order to correctly apply/remove them from
  event-emitting domNodes
  */
  this.keyupHandler = keyupHandler.bind(this);
  this.keydownHandler = keydownHandler.bind(this);

};

Kane.InputWizard.prototype = Object.create(InputWizardInterface);

Kane.InputWizard.prototype.addSubscriber = function (subscriber) {
  if ("object" !== typeof subscriber) { 
    throw new Error('no subscriber provided'); 
  }

  this.subscribers.push(subscriber);
  
  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.removeSubscriber = function (subscriber) {
  if ("object" !== typeof subscriber) { 
    throw new Error('no subscriber provided'); 
  }

  if (!_.contains(this.subscribers, subscriber)) {
    throw new Error('subscriber provided is not a in the list of subscribers!');
  }

  this.subscribers = _.without(this.subscribers, subscriber);

  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.attachToDomNode = function (domNode) {
  if (_.contains(this.domNodes, domNode)) {
    throw new Error('provided domNode is already attached!');
  }

  //if no domNode provided, set domNode to document body
  domNode = (domNode) ? domNode : document.body;
  this.domNodes.push(domNode);
 
  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.removeFromDomNode = function (domNode) {
  //we throw so that we dont silently fail to remove 
  if (!domNode) { 
    throw new Error('no domnode provided'); 
  } 

  if (!_.contains(this.domNodes, domNode)) {
    throw new Error('domNode provided not in the list of domNodes');
  } 
  
  //force call to deactivate to prevent phantom event listeners
  this.deactivateKeyboardForDomNode(domNode);

  this.domNodes = _.without(this.domNodes, domNode);

  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.activateKeyboardForDomNode = function (domNode) {
  if (!domNode) { 
    throw new Error('no domNode provided'); 
  }

  if (!_.contains(this.domNodes, domNode)) {
    throw new Error('provided domNode is not in array of attached domNodes');
  }

  domNode.addEventListener('keyup', this.keyupHandler);
  domNode.addEventListener('keydown', this.keydownHandler);

  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.deactivateKeyboardForDomNode = function (domNode) {
  if (!domNode) { 
    throw new Error('no domNode provided'); 
  }

  if (!_.contains(this.domNodes, domNode)) {
    throw new Error('provided domNode is not in array of attached domNodes');
  }
  
  //here we are removing the 'bound' versions of these handlers
  domNode.removeEventListener('keyup', this.keyupHandler);
  domNode.removeEventListener('keydown', this.keydownHandler);

  //useful for chaining
  return this;
};


function keyupHandler (e) {
  var keyName = keyboardMapping[e.keyCode];

  //no keyName found for this key
  if (!keyName) { return; }

  _.each(this.subscribers, function (sub) {
    if (sub.keyup) {
      sub.keyup.call(sub, keyName);
    }
  });
};

function keydownHandler (e) {
  var keyName = keyboardMapping[e.keyCode];

  //no keyName found for this key
  if (!keyName) { return; }

  _.each(this.subscribers, function (sub) {
    if (sub.keydown) {
      sub.keydown.call(sub, keyName);
    }
  });
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
  _.extend(this, settings);

  if (!settings.targetSceneName) {
    this.targetSceneName = this.name;
  }
  //defaults
  this.imageCache = null;
  this.imageLoader = null;
  this.jsonCache = null;
  this.jsonLoader = null;
  this.imageAssets = [];
  this.jsonAssets = [];

  Kane.Scene.call(this, settings);
};

Kane.LoadingScene.prototype = Object.create(Kane.Scene.prototype);

Kane.LoadingScene.prototype.onUpdate = function (dT) {
  var allImages
    , allJSON;

  //check if this is the currentScene, if not do nothing
  if (this.name !== this.game.getCurrentScene().name) {
    return;
  } 

  //if we have an imageCache, check if all our images are loaded
  if (this.imageCache) {
    allImages = this.imageCache.allInCache(this.imageAssets);
  } else {
    allImages = true;
  }

  //if we have a jsonCache, check if all our json is loaded  
  if (this.jsonCache) {
    allJSON = this.jsonCache.allInCache(this.jsonAssets);
  } else {
    allJSON = true;
  }
  
  //if all the images and json are in their respective caches, do something
  if (allImages && allJSON) {
    this.loadComplete();
  } else {
    this.stillLoading();
  }
};

Kane.LoadingScene.prototype.loadComplete = function () {
  this.game.setCurrentScene(this.targetSceneName); 
};

Kane.LoadingScene.prototype.stillLoading = function () {
  console.log('still loading...');
};

Kane.LoadingScene.prototype.onEnter = function () {
  console.log('loading assets for ', this.targetSceneName);
};

Kane.LoadingScene.prototype.onExit = function () {
  console.log('transitioning from ', this.name, ' to', this.targetSceneName);
};

});

minispade.register('particle.js', function() {
"use strict";

minispade.require('entity.js');

Kane.Particle = function (settings) {
  //default settings
  this.lifespan = 600;
  this.killtimer = Date.now() + this.lifespan;
  this.color = "#1382bb";
  this.h = 5;
  this.w = 5; 

  Kane.Entity.call(this, settings);
  this.doesCollide = false;
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

Kane.Projectile = function (settings) {
  this.lifespan = 2000;
  this.killtimer = Date.now() + this.lifespan;
  this.color = "#1356ab";
  this.doesCollide = true;
  this.h = 24;
  this.w = 24; 

  Kane.Entity.call(this, settings);
};

Kane.Projectile.prototype = Object.create(Kane.Entity.prototype);

Kane.Projectile.prototype.afterUpdate = function (dT) {
  if (Date.now() > this.killtimer) {
    this.kill();
  }
};

Kane.Projectile.prototype.collide = function (target) {
  //kill ourselves and the target
  this.kill();
  target.kill();

  //spawn "gib" particles
  for (var i=0; i<20; i++) {
    this.manager.spawn(
      Kane.Particle,
      {
        x: this.x,
        y:  this.y,
        dx: Math.random() * (this.dx + target.dx),
        dy: Math.random() * (this.dy + target.dy),
        w: 8,
        h: 8,
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
  onEnter: function () {},
  onExit: function () {},
  onDraw: function () {},
  onUpdate: function (dT) {},
  
  //list of required attributes
  name: ""
};

/*
note, if the settings provided include a name it will be overwritten
by the provided name 
*/
Kane.Scene = function (settings) {
  if (!settings.name) {
    throw new Error('no name provided in settings hash');
  }

  //apply settings object to this scene
  _.extend(this, settings);
};

Kane.Scene.prototype = Object.create(SceneInterface);

Kane.Scene.prototype.update = function (dT) {
  if (!dT) { 
    throw new Error('no dT provided to update'); 
  }

  if (this.entityManager) { 
    this.entityManager.removeDead();
    this.entityManager.sortBy('zIndex'); 
    this.entityManager.updateAll(dT);  
  } 

  this.onUpdate(dT);
};

Kane.Scene.prototype.draw = function () {
  if (this.entityManager) {
    this.entityManager.drawAll();
  }

  this.onDraw();
};

Kane.Scene.prototype.onEnter = function () {};
Kane.Scene.prototype.onExit = function () {};
Kane.Scene.prototype.onUpdate = function (dT) {};
Kane.Scene.prototype.onDraw = function () {};

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

  //drawplane is a surface to draw our map onto
  if (!settings.drawplane) {
    throw new Error('no drawplane provided in settiungs to constructor');
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
