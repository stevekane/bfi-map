require('entity.js');

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
