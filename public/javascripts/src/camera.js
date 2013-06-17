require('kane.js');
require('utils.js');

var CameraInterface = {
  update: function (dT) {},
  draw: function () {},
  drawBg: function () {},
  drawEntities: function () {},
  drawWorld: function () {},

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
Cameras can be initialized with the following attributes
bgPlane - draw background image
worldPlane - draw world
entityPlane - draw entities

Cameras must be instantiated with a scene object
the scene tells the camera to draw at 60fps and it provides
the data for the camera to draw

the camera MUST be attached to a scene before it is made active
*/
Kane.Camera = function (settings) {
  if (!settings.scene) {
    throw new Error('no scene provided in settings');
  }

  _.extend(this, settings);
};

Kane.Camera.prototype = Object.create(CameraInterface);

Kane.Camera.prototype.update = function (dT) {
  this.x = Kane.Utils.updatePosition(dT, this.dx, this.x);
  this.y = Kane.Utils.updatePosition(dT, this.dy, this.y);

  this.dx = Kane.Utils.updateVelocity(dT, this.ddx, this.dx);
  this.dy = Kane.Utils.updateVelocity(dT, this.ddy, this.dy);
};

Kane.Camera.prototype.draw = function () {
  if (this.scene.bgImage && this.bgPlane) {
    this.drawBg();
  } 
  if (this.scene.world && this.worldPlane) {
    this.drawWorld();
  } 
  if (this.scene.entityManager && this.entityPlane) {
    this.drawEntities();
  } 
};

Kane.Camera.prototype.drawBg = function () {
  this.bgPlane.clearAll();
  this.bgPlane.drawImage(this.scene.bgImage, 0, 0);
};

Kane.Camera.prototype.drawWorld = function () {

};

Kane.Camera.prototype.drawEntities = function () {
  //local ref to ents in entityManager
  var ents = this.scene.entityManager.listEntities()
    , checkCollision = Kane.Utils.checkBBCollision
    , entsToDraw;

  //clear the canvas each draw cycle
  this.entityPlane.clearAll();

  //loop over all entities and check if they "collide" w/ the camera
  //which means they should be drawn 
  entsToDraw = _(ents).filter(function (ent) {
    return checkCollision(ent, this);
  }, this);
  
  //if they should be drawn, calculate where they should be drawn
  //subtract their position in the world from the camera's
  _(entsToDraw).each(function (ent, index, ents) {
    this.entityPlane.drawRect(
      ent.color,
      Math.round(ent.x - this.x),
      Math.round(ent.y - this.y),
      ent.w,
      ent.h 
    ); 
  }, this);
};
