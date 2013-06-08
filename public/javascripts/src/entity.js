var EntityInterface = {
  setType: function (type) {},
  getType: function () {},
  setName: function (name) {},
  getName: function () {},
  setId: function () {},
  getId: function () {},
  kill: function () {},
  isDead: function () {},
  update: function (dT) {}, 
  draw: function () {},
};

Kane.Entity = function (argsHash) {
  if (!argsHash.drawplane) { 
    throw new Error('must provide valid drawplane'); 
  }

  _.extend(this, getDefaults(), argsHash);
};

Kane.Entity.prototype = Object.create(EntityInterface);

//getter/setter for type
Kane.Entity.prototype.setType = function (type) {
  if (!type) { throw new Error('no type provided'); }
  this.type = type;
};

Kane.Entity.prototype.getType = function () {
  return this.type;
};

//getter/setter for name
Kane.Entity.prototype.setName = function (name) {
  if (!name) { throw new Error('no name provided'); }
  this.name = name;
};

Kane.Entity.prototype.getName = function () {
  return this.name;
};

//getter/setter for id
Kane.Entity.prototype.setId = function (id) {
  if (!id) { throw new Error('no id provided'); }
  this.id = id;
};

Kane.Entity.prototype.getId = function () {
  return this.id;
};

Kane.Entity.prototype.kill = function () {
  this._isDead = true;
};

Kane.Entity.prototype.isDead = function () {
  return this._isDead;
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

function getDefaults () {

  return {
    //killing an entity will set this to true
    _isDead: false,

    //default color if no image available
    color: "#11ffbb",

    //position
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

    //render order
    zIndex: 0,

    id: 0,

    //identifiers
    name: "",
    type: "",
    
    //animation info  
    anims: [],
    currentAnim: {}
  };
};
