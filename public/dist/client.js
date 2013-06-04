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
  if ("object" !== typeof drawplane) { 
    throw new Error('drawplane must be object'); 
  }

  //assign id once (no need to clear this)
  this.id = Math.round(Math.random() * 100000);

  //rendering surface for entity entity
  this.drawplane = drawplane;
  
  setDefaults(this); 
};

Kane.Entity.prototype = Object.create(EntityInterface);

Kane.Entity.prototype.activate = function (settings) {
  if (!settings) { throw new Error('activate requires a hash of settings'); }
  
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
  
  this.x = updatePosition(dT, this.dx, this.ddx, this.x);
  potentialY = updatePosition(dT, this.dy, this.ddy, this.y);
  this.y = (potentialY >= 0) ? potentialY : 0;
};

Kane.Entity.prototype.draw = function () {
  if (false == this.isActive) { throw new Error('cannot draw an inactive entity'); }

  if (!this.image) {
    this.drawplane.drawRect(this.color, this.x, this.y, this.w, this.h);
  } else {
    //this.drawplane.drawImage
  }
};

function updatePosition(dT, v, a, oldPos) {
  return (.5 * a * dT * dT) + (v * dT) + oldPos;
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
  drawActive: function () {}
};

//requires array of entities
Kane.EntityManager = function (entities, drawplane) {
  if (!entities) { throw new Error('must provide array of entities'); }
  if (!drawplane) { throw new Error('must provide drawplane'); }
  
  this.drawplane = drawplane;
  this.store = entities;
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

function removeElement (element, array) {
  array.splice(array.indexOf(element), 1);
};

Kane.EntityManager.prototype.drawActive = function () {
  this.drawplane.clearAll();
  this.active.forEach(function (entity) { 
    entity.draw(); 
  });
};

});

minispade.register('game.js', function() {
"use strict";
var GameInterface = {
  start: function () {},
  stop: function () {}
};

Kane.Game = function (entityManager) {
  this.isRunning = false;
  this.entityManager = entityManager;
  this.currentTimeStamp = 0;
  this.previousTimeStamp = 0;
};

Kane.Game.prototype = Object.create(GameInterface); 

//private
Kane.Game.prototype._loop = function () {
  var dT;

  //update timestamps
  this.previousTimeStamp = this.currentTimeStamp;
  this.currentTimeStamp = Date.now();

  //calculate deltaT
  dT = this.currentTimeStamp - this.previousTimeStamp;
    
  if (!this.isRunning) { return; }

  //update all entity positions
  this.entityManager.updateActive(dT);
  //draw all active entities
  this.entityManager.drawActive();

  window.requestAnimationFrame(this._loop.bind(this));
};

//public
Kane.Game.prototype.start = function () {
  this.isRunning = true;
  this.currentTimeStamp = Date.now();
  window.requestAnimationFrame(this._loop.bind(this));
};

Kane.Game.prototype.stop = function () {
  this.currentTimeStamp = 0;
  this.previousTimeStamp = 0;
  this.isRunning = false;
};

});

minispade.register('main.js', function() {
"use strict";
window.Kane = {};
minispade.require('game.js');
minispade.require('drawplane.js');
minispade.require('entity.js');
minispade.require('entitymanager.js');

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

function createEntities (drawplane, count) {
  var ar = [];

  for (var i=0; i<count; i++) {
    ar.push(new Kane.Entity(drawplane)); 
  }
  
  return ar;
};

function createEntityManager (entities, drawplane) {
  return new Kane.EntityManager(entities, drawplane);
};

function createGame (entityManager) {
  return new Kane.Game(entityManager);
};

var bgCanvas = createCanvas(640, 480, 'gameboard')
  , bgPlane = createDrawPlane(bgCanvas)
  , entityCanvas = createCanvas(640, 480, 'entities')
  , entityPlane = createDrawPlane(entityCanvas)
  
  , entities = createEntities(entityPlane, 200)
  , entityManager = createEntityManager(entities, entityPlane)
  , game = createGame(entityManager)
  , entityCount = 200;

//color background
bgPlane.fillAll('#123aaa');

//create entities 
for (var i=0; i<entityCount; i++) {
  entityManager.activateFromStore({
    x: Math.floor(Math.random() * 40),
    y: Math.floor(Math.random() * 40),
    h: 20,
    w: 20,
    dx: Math.random()/10,
    dy: Math.random()/10 
  });
}

game.start();

});
