require('kane.js');
require('utils.js');

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
