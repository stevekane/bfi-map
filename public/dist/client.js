minispade.register('clock.js', function() {
"use strict";
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
  kill: function () {},
  isDead: function () {},
  beforeUpdate: function (dT) {},
  update: function (dT) {}, 
  afterUpdate: function (dT) {},
  beforeDraw: function () {},
  draw: function () {},
  afterDraw: function () {},
  
  /*
  here we expose required properties of entities that are not
  dependencies.  This makes us able to guarantee that these
  properties exist w/o needing explicit getters/setters for each
  */
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

Kane.Entity = function (argsHash) {
  if (!argsHash.drawplane) { 
    throw new Error('must provide valid drawplane'); 
  }
  
  this._isDead = false;
  _.extend(this, argsHash);
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

  if (undefined == dT) { throw new Error('delta time not provided'); }
  
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

Kane.Entity.prototype.afterDraw = function () {};

function updatePosition(dT, v, oldPos) {
  return oldPos + dT * v;
};

function updateVelocity(dT, a, oldVel) {
  return oldVel + dT * a;
}; 

});

minispade.register('entitymanager.js', function() {
"use strict";
var EntityManagerInterface = {
  generateUniqueId: function () {},
  spawn: function (constructor, args) {},
  removeDead: function () {},
  sortBy: function (propName, ascending) {},
  updateAll: function (dT) {},
  drawAll: function () {},
  listEntities: function () {},
  findByType: function (type) {},
  callForAll: function (methodName, args) {},
  applyForAll: function (methodName, argArray) {},

  //define mandatory interface attribute
  drawplane: {}
};

//requires array of entities
Kane.EntityManager = function (drawplane) {
  if (!drawplane) { throw new Error('must provide drawplane'); }
  this.drawplane = drawplane;
};

Kane.EntityManager.prototype = new Array;

/*
different than "normal" syntax here is used to specifically state our intention
to add our interface methods onto the prototype we have defined which inherits core
functionality from Array
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
  if (!constructor) { throw new Error('no constructor provided'); }

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
  this.callForAll('update', dT);
};

Kane.EntityManager.prototype.drawAll = function () {
  //clear the drawplane
  this.drawplane.clearAll();

  //call draw for each entity
  this.callForAll('draw'); 
};

Kane.EntityManager.prototype.listEntities = function () {
  return this;
};

Kane.EntityManager.prototype.findByType = function (type) {
  if (!type) { throw new Error('no type provided'); }

  return this.filter(function (ent) {
    return (type === ent.type);
  });
};

Kane.EntityManager.prototype.findByName = function (name) {
  if (!name) { throw new Error('no name provided'); }

  return this.filter(function (ent) {
    return (name === ent.name);
  });
};

/*
additional arguments may be passed when calling this.
they will be passed to each object
*/
Kane.EntityManager.prototype.callForAll = function (methodName) {
  var args = Array.prototype.slice.call(arguments, 1);

  if (!methodName) { throw new Error('no methodName provided'); }

  this.forEach(function (entity) {
    if (entity[methodName]) {
      entity[methodName].apply(entity, args);
    }
  });
};

Kane.EntityManager.prototype.applyForAll = function (methodName, argsArray) {
  if (!methodName) { throw new Error('no methodName provided'); }

  this.forEach(function (entity) {
    if (entity[methodName]) {
      entity[methodName].apply(entity, argsArray);
    }
  });
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

minispade.register('inputwizard.js', function() {
"use strict";
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

  //we create instances of these functions that have a bound 
  //"this" value in order to correctly apply/remove them from
  //event-emitting domNodes
  this.keyupHandler = keyupHandler.bind(this);
  this.keydownHandler = keydownHandler.bind(this);

};

Kane.InputWizard.prototype = Object.create(InputWizardInterface);

Kane.InputWizard.prototype.addSubscriber = function (subscriber) {
  if ("object" !== typeof subscriber) { throw new Error('no subscriber provided'); }

  this.subscribers.push(subscriber);
  
  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.removeSubscriber = function (subscriber) {
  if ("object" !== typeof subscriber) { throw new Error('no subscriber provided'); }
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
  if (!domNode) { throw new Error('no domnode provided'); } 

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
  if (!domNode) { throw new Error('no domNode provided'); }

  if (!_.contains(this.domNodes, domNode)) {
    throw new Error('provided domNode is not in array of attached domNodes');
  }

  domNode.addEventListener('keyup', this.keyupHandler);
  domNode.addEventListener('keydown', this.keydownHandler);

  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.deactivateKeyboardForDomNode = function (domNode) {
  if (!domNode) { throw new Error('no domNode provided'); }

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

minispade.register('main.js', function() {
"use strict";
window.Kane = {};
minispade.require('clock.js');
minispade.require('game.js');
minispade.require('scene.js');
minispade.require('drawplane.js');
minispade.require('entity.js');
minispade.require('entitymanager.js');
minispade.require('player.js');
minispade.require('inputevent.js');
minispade.require('inputqueue.js');
minispade.require('inputmanager.js');
minispade.require('inputwizard.js');

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

function createEntityManager (drawplane) {
  return new Kane.EntityManager(drawplane);
};

function createPlayer (drawPlane, inputQueue) {
  return new Kane.Player(drawPlane, inputQueue);
};

function createScene (name, settingsHash) {
  return new Kane.Scene(name, settingsHash);
};

function createGame () {
  return new Kane.Game();
};

/*

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

//Construction of specific scene
//setup entity set for this scene
var entityCanvas = createCanvas(640, 480, 'entities')
  , entityPlane = createDrawPlane(entityCanvas)
  , entityManager = createEntityManager(entityPlane)
  , clock = new Kane.Clock()
  , game = new Kane.Game({
    clock: clock
  });

//pass in our default input Queue and our entityManager
var ingame = new Kane.Scene('ingame', {
  inputQueue: inputQueue,
  entityManager: entityManager 
});

//setup inputHandling for ingame
ingame.processInput = function () {
  var events = this.inputQueue.fetchAllEvents();
  
  events.forEach(function (event) {
    this.entityManager.spawn(
      Kane.Entity,
      {
        drawplane: entityPlane,
        x: Math.floor(Math.random() * 640),
        y: Math.floor(Math.random() * 480),
        dx: Math.random(),
        dy: -1 * Math.random(),
        w: 40,
        h: 40,
        ddy: .001,
        color: generateColor()
      }
    );
  }, this); 
};

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

*/

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
  update: function (dT) {},
  draw: function () {},
  onEnter: function () {},
  onExit: function () {},
  onDraw: function () {},
  onUpdate: function (dT) {},
  processInput: function () {},

  //list of required attributes
  name: ""
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

  //process inputs hook
  this.processInput();

  if (this.entityManager) { 
    this.entityManager.updateAll(dT);  
    this.entityManager.drawAll();
  } 

  this.onUpdate(dT);
};

Kane.Scene.prototype.draw = function () {
  if (this.entityManager) {
    this.entityManager.drawActive();
  }

  this.onDraw();
};

//define what your scene should do to process input
Kane.Scene.prototype.processInput = function () {};

});
