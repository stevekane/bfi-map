var EntityInterface = {
  activate: function () {},
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
  
  //boolean flag to determine if this object is in use already
  this.isActive = false;
  
  //rendering surface for this entity
  this.drawplane = drawplane;
  
  //default color if no image available
  this.color = "#11ffbb";

  //position
  this.x = 0;
  this.y = 0;

  //previous positions
  this.lastx = 0;
  this.lasty = 0;

  //dimensions
  this.w = 0;
  this.h = 0;

  //velocity
  this.dx = 0;
  this.dy = 0;

  //accel
  this.ddx = 0;
  this.ddy = 0;

  //render order
  this.zIndex = 0;

  //identifiers
  this.id = Math.round(Math.random() * 100000);
  this.name = "";
  this.type = "";
  
  //animation info  
  this.anims = [];
  this.currentAnim = {}
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

Kane.Entity.prototype.update = function (dT) {
  var potentialY;
  if (!dT) { throw new Error('delta time not provided'); }
  
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

