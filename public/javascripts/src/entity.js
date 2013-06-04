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
