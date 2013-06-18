require('kane.js');
require('utils.js');

var CameraInterface = {
  update: function (dT) {},
  draw: function () {},
  drawBg: function () {},
  drawEntities: function () {},
  drawWorld: function () {},
  setSize: function (w, h) {},

  //public interface attributes
  x: 0,
  y: 0,

  //previous positions
  lastx: 0,
  lasty: 0,  

  //dimensions
  w: 640,
  h: 480,
  
  //velocity
  dx: 0,
  dy: 0,
  
  //accel
  ddx: 0,
  ddy: 0,
};

/*
Cameras must be instantiated with a scene object
the scene tells the camera to draw at 60fps and it provides
the data for the camera to draw

Cameras must also be instantiated with a planes object that must
contain at least one Kane.DrawPlane instance 

the camera MUST be attached to a scene before it is made active
*/
Kane.Camera = function (settings) {
  if (!settings.planes) {
    throw new Error('no planes object provided to constructor');
  }

  if (0 === _.keys(settings.planes).length) {
    throw new Error('no planes provided to constructor'); 
  }

  _.extend(this, settings);

  //set the size of the camera and all drawplanes
  this.setSize(
    settings.w || 640,
    settings.h || 480
  );
};

Kane.Camera.prototype = Object.create(CameraInterface);

Kane.Camera.prototype.update = function (dT) {
  this.x = Kane.Utils.updatePosition(dT, this.dx, this.x);
  this.y = Kane.Utils.updatePosition(dT, this.dy, this.y);

  this.dx = Kane.Utils.updateVelocity(dT, this.ddx, this.dx);
  this.dy = Kane.Utils.updateVelocity(dT, this.ddy, this.dy);
};

Kane.Camera.prototype.draw = function () {
  if (this.scene.bgImage && this.planes.bgPlane) {
    this.drawBg();
  } 
  if (this.scene.world && this.planes.worldPlane) {
    this.drawWorld();
  } 
  if (this.scene.entityManager && this.planes.entityPlane) {
    this.drawEntities();
  } 
};

Kane.Camera.prototype.drawBg = function () {
  this.planes.bgPlane.clearAll();
  this.planes.bgPlane.drawImage(this.scene.bgImage, 0, 0);
};

Kane.Camera.prototype.drawWorld = function () {

};

Kane.Camera.prototype.drawEntities = function () {
  //local ref to ents in entityManager
  var ents = this.scene.entityManager.listEntities()
    , checkCollision = Kane.Utils.checkBBCollision
    , entsToDraw;

  //clear the canvas each draw cycle
  this.planes.entityPlane.clearAll();

  //loop over all entities and check if they "collide" w/ the camera
  //which means they should be drawn 
  entsToDraw = _(ents).filter(function (ent) {
    return checkCollision(ent, this);
  }, this);
  
  //if they should be drawn, calculate where they should be drawn
  //subtract their position in the world from the camera's
  _(entsToDraw).each(function (ent, index, ents) {
    if (ent.currentSprite) {
      this.planes.entityPlane.drawSprite(
        ent.currentSprite,
        ent.x - this.y,
        ent.y - this.y,
        ent.w,
        ent.h
      );
    } else {
      this.planes.entityPlane.drawRect(
        ent.color,
        ent.x - this.x,
        ent.y - this.y,
        ent.w,
        ent.h 
      ); 
    }
  }, this);
};

Kane.Camera.prototype.setSize = function (w, h) {
  this.w = w;
  this.h = h;

  //set the size of all the planes this camera controls
  _.each(this.planes, function (plane) {
    plane.setSize(w, h);
  }); 
};
