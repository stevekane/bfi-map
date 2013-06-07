minispade.register('drawplane.js', function() {
"use strict";
var DrawPlaneInterface = {
  fillAll: function (hexColor) {},
  drawRect: function (color, x, y, w, h) {},
  drawImage: function (image, sx, sy, sw, sh, x, y, w, h) {},
  clearAll: function () {}
};

Kane.DrawPlane = function (board) {
  if (!board) { throw new Error('must provide canvas domnode'); }

  this.board = board;
  this.ctx = board.getContext('2d');
};

Kane.DrawPlane.prototype = Object.create(DrawPlaneInterface);

//private
Kane.DrawPlane.prototype._validateColor = function (color) {
  var validColor = /^#[0123456789abcdef]*$/i;

  return color.match(validColor);  
};

//creates new canvas and attaches it to target of DOM
var _createBoard = function (name, target) {
  var boardEl = document.createElement('canvas');

  boardEl.id = name;
  target.appendChild(boardEl);
  return document.getElementById(name);
};

//public
//this method will fill the entire board with a solid color
Kane.DrawPlane.prototype.fillAll = function (color) {
  this.drawRect(color, 0, 0, this.board.width, this.board.height);
};

//draw rect w/ provided location/dimesions
Kane.DrawPlane.prototype.drawRect = function (color, x, y, w, h) {
  if (!this._validateColor(color)) { 
    throw new TypeError('invalid color'); 
  }
  //color must be valid hex
  this.ctx.fillStyle = color;
  this.ctx.fillRect(x, y, w, h);
};

Kane.DrawPlane.prototype.drawImage = function ( image, 
                                                sx, sy, sw, sh, 
                                                x, y, w, h) {
  var isValidImage = image instanceof Image;

  if (!isValidImage) { throw new Error('not a valid image!'); }
  this.ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
};

Kane.DrawPlane.prototype.clearAll = function () {
  this.ctx.clearRect(0, 0, this.board.width, this.board.height);
};

});

minispade.register('entity.js', function() {
"use strict";
var EntityInterface = {
  activate: function (settings) {},
  deactivate: function () {},
  update: function (dT) {}, 
  draw: function () {},
};

Kane.Entity = function (drawplane) {
  if (!drawplane) { 
    throw new Error('must provide valid drawplane'); 
  }

  //assign id once (no need to clear this)
  this.id = Math.round(Math.random() * 100000);

  //rendering surface for entity entity
  this.drawplane = drawplane;
  
  setDefaults(this); 
};

Kane.Entity.prototype = Object.create(EntityInterface);

Kane.Entity.prototype.activate = function (settings) {
  if (!settings) { 
    throw new Error('activate requires a hash of settings'); 
  }
  
  //check if keys in hash are valid
  for (var key in settings) {
    if(!this.hasOwnProperty(key)) {
      throw new Error('invalid key provided in activate settings'); 
    }
    
    //assign each setting to the entity
    this[key] = settings[key];
  }
  this.isActive = true;
};

Kane.Entity.prototype.deactivate = function () {
  this.isActive = false; 
  setDefaults(this);
};

Kane.Entity.prototype.update = function (dT) {
  var potentialY;

  if (undefined == dT) { throw new Error('delta time not provided'); }
  
  //update positions after checking for 0
  this.x = updatePosition(dT, this.dx, this.x);
  this.y = updatePosition(dT, this.dy, this.y);

  this.dx = updateVelocity(dT, this.ddx, this.dx);
  this.dy = updateVelocity(dT, this.ddy, this.dy);
};

Kane.Entity.prototype.draw = function () {
  if (false == this.isActive) { 
    throw new Error('cannot draw an inactive entity'); 
  }

  if (!this.image) {
    this.drawplane.drawRect(
      this.color, 
      Math.floor(this.x),
      Math.floor(this.y), 
      this.w, 
      this.h
    );
  } else {
    //this.drawplane.drawImage
  }
};

function updatePosition(dT, v, oldPos) {
  return oldPos + dT * v;
};

function updateVelocity(dT, a, oldVel) {
  return oldVel + dT * a;
}; 

function setDefaults (entity) {
  //boolean flag to determine if this object is in use already
  entity.isActive = false;
  
  //default color if no image available
  entity.color = "#11ffbb";

  //position
  entity.x = 0;
  entity.y = 0;

  //previous positions
  entity.lastx = 0;
  entity.lasty = 0;

  //dimensions
  entity.w = 0;
  entity.h = 0;

  //velocity
  entity.dx = 0;
  entity.dy = 0;

  //accel
  entity.ddx = 0;
  entity.ddy = 0;

  //render order
  entity.zIndex = 0;

  //identifiers
  entity.name = "";
  entity.type = "";
  
  //animation info  
  entity.anims = [];
  entity.currentAnim = {}
};

});

minispade.register('entitymanager.js', function() {
"use strict";
var EntityManagerInterface = {
  activateFromStore: function (settings) {},
  deactivate: function (entity) {},
  updateActive: function (dT) {},
  drawActive: function () {},
};

//requires array of entities
Kane.EntityManager = function (entities, drawplane) {
  if (!entities) { throw new Error('must provide array of entities'); }
  if (!drawplane) { throw new Error('must provide drawplane'); }
  
  this.store = entities;
  this.drawplane = drawplane;
  this.active = [];
};

Kane.EntityManager.prototype = Object.create(EntityManagerInterface);

Kane.EntityManager.prototype.activateFromStore = function (settings) {
  var storeEntity;
  if (!settings) { throw new Error('no settings hash provided!'); }
  if (0 === this.store.length) { throw new Error('store is empty!'); }

  storeEntity = this.store.shift();

  //set this entity's active flag
  storeEntity.activate(settings);

  //add store entity to active array
  this.active.unshift(storeEntity);
};

Kane.EntityManager.prototype.deactivate = function (entity) {
  var activeEnt;

  if (!entity) { throw new Error('no entity provided to deactivate'); } 

  activeEnt = this.active.filter(function (ent) { return entity === ent })[0]; 
  if (!activeEnt) { throw new Error('entity not found in active!'); }
  
  //weird method to target this element and remove it
  removeElement(activeEnt, this.active);  

  //call entity's deactivate method
  activeEnt.deactivate();
  this.store.unshift(activeEnt);
};

Kane.EntityManager.prototype.updateActive = function (dT) {
  if (undefined == dT) { throw new Error('no dT provided to updateActive'); }

  this.active.forEach(function (entity) { 
    entity.update(dT); 
  });
};

Kane.EntityManager.prototype.drawActive = function () {
  this.drawplane.clearAll();
  this.active.forEach(function (entity) { 
    entity.draw(); 
  });
};


function removeElement (element, array) {
  array.splice(array.indexOf(element), 1);
};


});

minispade.register('game.js', function() {
"use strict";
var GameInterface = {
  addScene: function (scene) {},
  removeScene: function (name) {},
  getScenes: function () {},
  getCurrentScene: function () {},
  setCurrentScene: function (name) {},
  start: function () {},
  stop: function () {}
};

Kane.Game = function (settings) {
  _.extend(this, settings);  

  //a scenes object
  this.scenes = {};
  this.currentScene = null;

  this.isRunning = false;
  this.currentTimeStamp = 0;
  this.previousTimeStamp = 0;
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
  dT = this.currentTimeStamp - this.previousTimeStamp;
    
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
  this.isRunning = true;
  this.currentTimeStamp = Date.now();
  window.requestAnimationFrame(this._loop.bind(this));
  //TESTS FOR FPS MEASUREMENT
  this.fps = createFps();
};

Kane.Game.prototype.stop = function () {
  this.currentTimeStamp = 0;
  this.previousTimeStamp = 0;
  this.isRunning = false;
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


});

minispade.register('inputevent.js', function() {
"use strict";
Kane.InputEvent = function (type, data) {
  this.type = type;
  this.data = data;  
};

});

minispade.register('inputmanager.js', function() {
"use strict";

minispade.require('inputevent.js');

var InputManagerInterface = {
  handleInputEvent: function () {},
  activateKeyUpHandler: function () {},
  activateKeyDownHandler: function () {},
  getActiveHandlers: function () {},
};

Kane.InputManager = function (inputQueue, domNode) {
  if (!inputQueue) { 
    throw new Error('no inputQueue provided to constructor'); 
  }
  this.inputQueue = inputQueue;
  this.domNode = (domNode) ? domNode : document.body;
  this.activeHandlers = [];
};

Kane.InputManager.prototype = Object.create(InputManagerInterface);

//type is a string, data is an object
Kane.InputManager.prototype.handleInputEvent = function (type, data) {
  var inputEvent;
  if (!type) { throw new Error('must provide type to handleInputEvent'); }
  if (!data) { throw new Error('must provide data to handleInputEvent'); }

  inputEvent = new Kane.InputEvent(type, data);
  this.inputQueue.enqueueEvent(inputEvent);
};

Kane.InputManager.prototype.activateKeyUpHandler = function () {
  //do nothing is keyUpHandler already active
  if (searchForMatch(this.activeHandlers, keyUpHandler)) { return; }

  this.activeHandlers.push(keyUpHandler); 
  this.domNode.addEventListener('keyup', keyUpHandler.bind(this));
};

Kane.InputManager.prototype.activateKeyDownHandler = function () {
  //do nothing is keyUpHandler already active
  if (searchForMatch(this.activeHandlers, keyDownHandler)) { return; }

  this.activeHandlers.push(keyDownHandler); 
  this.domNode.addEventListener('keydown', keyDownHandler.bind(this));
};

Kane.InputManager.prototype.getActiveHandlers = function () {
  return this.activeHandlers;
};

//helper to search an array for an element and return true if found
function searchForMatch (array, matchee) {
  for (var i=0; i<array.length; i++) {
    if (array[i] === matchee) { return true; }
  }
  return false;
};

function keyUpHandler (e) {
  //TODO: hack to only prevent for movement keys, should be made more general
  if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode ===40) {
    e.preventDefault();
  }
  this.handleInputEvent('keyup', {keyCode: e.keyCode});
};

function keyDownHandler (e) {
  //TODO: hack to only prevent for movement keys, should be made more general
  if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode ===40) {
    e.preventDefault();
  }
  this.handleInputEvent('keydown', {keyCode: e.keyCode});
};

});

minispade.register('inputqueue.js', function() {
"use strict";
var InputQueueInterface = {
  enqueueEvent: function (ev) {},
  fetchNextEvent: function () {},
  fetchAllEvents: function () {},
  resetQueue: function () {},
};

Kane.InputQueue = function () {
  this.eventQueue = [];
};

Kane.InputQueue.prototype = Object.create(InputQueueInterface);

//pushes events onto tail of the queue
Kane.InputQueue.prototype.enqueueEvent = function (ev) {
  this.eventQueue.push(ev);
};

//shifts events from head of the queue
Kane.InputQueue.prototype.fetchNextEvent = function () {
  if (0 === this.eventQueue.length) { return null; }
  return this.eventQueue.shift(); 
};

//returns the eventQueue array and resets it
Kane.InputQueue.prototype.fetchAllEvents = function () {
  var events = [];

  events = this.eventQueue;
  this.resetQueue();
  return events; 
};

//This does NOT return the queue, just resets it
Kane.InputQueue.prototype.resetQueue = function () {
  this.eventQueue = [];
};

});

minispade.register('main.js', function() {
"use strict";
window.Kane = {};
minispade.require('game.js');
minispade.require('scene.js');
minispade.require('drawplane.js');
minispade.require('entity.js');
minispade.require('entitymanager.js');
minispade.require('player.js');
minispade.require('inputevent.js');
minispade.require('inputqueue.js');
minispade.require('inputmanager.js');

function createCanvas (w, h, name) {
  var canvas = document.createElement('canvas');
  
  canvas.id = name;
  canvas.height = h;
  canvas.width = w;
  
  document.body.appendChild(canvas);

  return document.getElementById(name);
};

function createDrawPlane (canvas) {
  return new Kane.DrawPlane(canvas);
};

function createInputQueue () {
  return new Kane.InputQueue();
};

//note, domNode is NOT a drawplane but the node itself
function createInputManager (inputQueue, domNode) {
  return new Kane.InputManager(inputQueue, domNode);
};

function createEntities (drawplane, count) {
  var ar = [];

  for (var i=0; i<count; i++) {
    ar.push(new Kane.Entity(drawplane)); 
  }
  
  return ar;
};

function createEntityManager (entities, drawplane, player) {
  return new Kane.EntityManager(entities, drawplane, player);
};

function createPlayer (drawPlane, inputQueue) {
  return new Kane.Player(drawPlane, inputQueue);
};

function createScene (name, settingsHash) {
  return new Kane.Scene(name, settingsHash);
};

function createGame (entityManager, inputQueue) {
  return new Kane.Game(entityManager, inputQueue);
};

//global background canvas object
var bgCanvas = createCanvas(640, 480, 'gameboard')
  , bgPlane = createDrawPlane(bgCanvas);

//color background
bgPlane.fillAll(generateColor());

//Setup a basic inputManager and inputQueue
var inputQueue = createInputQueue()
  , inputManager = createInputManager(inputQueue);

//turn on input listeners
inputManager.activateKeyUpHandler();
inputManager.activateKeyDownHandler();

/*
Construction of specific scene
*/
//setup entity set for this scene
var entityCanvas = createCanvas(640, 480, 'entities')
  , entityPlane = createDrawPlane(entityCanvas);

var entityCount = 20000
  , entities = createEntities(entityPlane, entityCount)
  , entityManager = createEntityManager(entities, entityPlane)
  , game = createGame();

//pass in our default input Queue and our entityManager
var ingame = new Kane.Scene('ingame', {
  inputQueue: inputQueue,
  entityManager: entityManager 
});

//configure the game object before starting it
game.addScene(ingame);
game.setCurrentScene('ingame');

//just a quick hack to show the scene name
var div = document.createElement('div');

div.id = 'scenename';
div.style.position = "absolute";
div.style.left = 100;
div.textContent = game.getCurrentScene().name;
document.body.appendChild(div);

game.start();

function generateColor () {
  return "#" + Math.random().toString(16).slice(2, 8);
};


});

minispade.register('player.js', function() {
"use strict";

minispade.require('entity.js');

//class inherits from Kane.Entity

Kane.Player = function (drawplane, inputQueue) {
  if (!drawplane) { throw new Error('no drawplane provided to constructor'); }
  if (!inputQueue) { throw new Error('no input queue provided to constructor'); }

  this.drawplane = drawplane;
  this.inputQueue = inputQueue;
  this.moveSpeed = .1;

  //TODO: possibly refactor to make this a passable dependency??
  this.keyMap = createKeyMap();
  setDefaults(this); 
};

Kane.Player.prototype = Object.create(Kane.Entity.prototype);

Kane.Player.prototype.processInputs = function () {
  var inputs = this.inputQueue.fetchAllEvents();

  //compare each input to the keymap to extract the desired method name
  //then execute the method name
  inputs.forEach(function (input) { 
    var matchingMethodName = this.keyMap[input.type][input.data.keyCode]; 

    if (matchingMethodName) { 
      this[matchingMethodName](); 
    }
  }, this);
};

//TODO: THESE ARE FOR STATIC 2d MOTION!  Will not work correctly w/ grav
Kane.Player.prototype.moveUp = function () {
  this.dy = -1 * this.moveSpeed;
};

Kane.Player.prototype.moveDown = function () {
  this.dy = this.moveSpeed;
};

Kane.Player.prototype.moveLeft = function () {
  this.dx = -1 * this.moveSpeed;
};

Kane.Player.prototype.moveRight = function () {
  this.dx = this.moveSpeed;
};

Kane.Player.prototype.cancelMoveUp = function () {
  this.dy = 0;
};

Kane.Player.prototype.cancelMoveDown = function () {
  this.dy = 0;
};

Kane.Player.prototype.cancelMoveLeft = function () {
  this.dx = 0;
};

Kane.Player.prototype.cancelMoveRight = function () {
  this.dx = 0;
};

function createKeyMap () {
  //basic movement
  return {
    keyup: {
      38: 'cancelMoveUp',
      40: 'cancelMoveDown',
      37: 'cancelMoveLeft',
      39: 'cancelMoveRight'
    },
    keydown: {
      38: 'moveUp',
      40: 'moveDown',
      37: 'moveLeft',
      39: 'moveRight'
    },
  };
};

function setDefaults (entity) {
  //boolean flag to determine if this object is in use already
  entity.isActive = false;
  
  //default color if no image available
  entity.color = "#11ffbb";

  //position
  entity.x = 0;
  entity.y = 0;

  //previous positions
  entity.lastx = 0;
  entity.lasty = 0;

  //dimensions
  entity.w = 0;
  entity.h = 0;

  //velocity
  entity.dx = 0;
  entity.dy = 0;

  //accel
  entity.ddx = 0;
  entity.ddy = 0;

  //render order
  entity.zIndex = 0;

  //identifiers
  entity.name = "";
  entity.type = "";
  
  //animation info  
  entity.anims = [];
  entity.currentAnim = {}
};

});

minispade.register('scene.js', function() {
"use strict";
/*
update and draw generally should be left alone.  they both expose hooks
for calling onUpdate and onDraw which may be defined however you desire

onEnter and onExit may be defined to do w/e you desire and they will be called
by the game object that owns this scene on scene transitions 

processInput is a method you can define and hook up if desired.  generally
speaking, your scene should have an inputQueue passed into its constructor
if you are intending to process input directly on the scene itself
*/
var SceneInterface = {
  onEnter: function () {},
  onExit: function () {},
  onDraw: function () {},
  onUpdate: function (dT) {},
  processInput: function () {},
  update: function (dT) {},
  draw: function () {},
};

/*
note, if the settings provided include a name it will be overwritten
by the provided name 
*/
Kane.Scene = function (name, settings) {
  //apply settings object to this scene
  _.extend(this, settings);

  this.name = name;

  //this will be toggled by the game that owns this scene
  this.isActive = false;
};

Kane.Scene.prototype = Object.create(SceneInterface);

Kane.Scene.prototype.update = function (dT) {
  if (!dT) { throw new Error('no dT provided to update'); }

  if (this.entityManager) { 
    this.entityManager.updateActive(dT);  
  } 

  this.onUpdate(dT);
};

Kane.Scene.prototype.draw = function () {
  if (this.entityManager) {
    this.entityManager.drawActive();
  }

  this.onDraw();
};

});
