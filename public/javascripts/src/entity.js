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
