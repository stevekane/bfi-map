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

minispade.register('entitymanager.js', function() {
"use strict";
var EntityManagerInterface = {

};

Kane.EntityManager = function (entClass) {
  if (!entClass) { throw new Error ('must provide entity class!'); } 

  var array = new Array();
  this.entities = array; 
};

Kane.EntityManager.prototype = Object.create(EntityManagerInterface);

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
};

Kane.Game.prototype = Object.create(GameInterface); 

//private
Kane.Game.prototype._loop = function () {
  if (!this.isRunning) { return; }

  //update all entity positions
  //scroll the background
  //play sounds?
  window.requestAnimationFrame(this._loop.bind(this));
};

//public
Kane.Game.prototype.start = function () {
  this.isRunning = true;
  window.requestAnimationFrame(this._loop.bind(this));
};

Kane.Game.prototype.stop = function () {
  this.isRunning = false;
};

});

minispade.register('main.js', function() {
"use strict";
window.Kane = {};
minispade.require('game.js');
minispade.require('drawplane.js');
minispade.require('player.js');
minispade.require('entitymanager.js');

var canvas = document.createElement('canvas');
canvas.id = "board";
canvas.height = 480;
canvas.width = 640;

document.body.appendChild(canvas);
var canvasInDom = document.getElementById('board'); 

var board = new Kane.DrawPlane(canvasInDom);
var game = new Kane.Game();
var player = new Kane.Player();

board.fillAll('#123456');

game.start();

});

minispade.register('player.js', function() {
"use strict";
var PlayerInterface = {
  move: function () {},
  getYVelocity: function () {},
  getJumpVelocity: function () {},
  jump: function () {},
  duck: function () {}
};

Kane.Player = function () {
  this.isJumping = false;
  this.isDucking = false;
  this.yVelocity = 0;
  this.height = 60;
  this.y = 0 + this.height;

  this.jumpVelocity = 20; 
  this.duckDuration = 700;
  this.grav = -5;
};

Kane.Player.prototype = Object.create(PlayerInterface);

//timeDelta is in seconds
Kane.Player.prototype.move = function (timeDelta) {
  var newHeight;

  if (null === timeDelta) { 
    throw new Error('no timeDelta provided to move');
  }
  if ('number' !== typeof(timeDelta)) {
    throw new Error('move must be provided a numerical timeDelta');
  }
  //calculate new position
  newHeight = calcPos(timeDelta, this.yVelocity, this.y, this.grav);
  newHeight = (newHeight < this.height) ? this.height : newHeight;
  this.y = newHeight; 
  console.log(this.y);
};

Kane.Player.prototype.getYVelocity = function () {
  return this.yVelocity;
};

Kane.Player.prototype.getJumpVelocity = function () {
  return this.jumpVelocity;
};

Kane.Player.prototype.jump = function () {
  //do nothing if player is not on the ground
  if (this.yVelocity !== 0) { return; }

  this.isJumping = true;
  this.yVelocity = this.yVelocity + this.jumpVelocity;
};

Kane.Player.prototype.duck = function () {
  if (this.isDucking) { return; } 
  if (this.isJumping) { return; }

  this.isDucking = true;
  window.setTimeout(function () {
    this.isDucking = false;    
  }.bind(this), this.duckDuration);
};

function calcPos (dT, vel, pos, accel) {
  return (.5 * accel * dT * dT + vel * dT + pos);
};

});
