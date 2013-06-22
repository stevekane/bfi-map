require('kane.js');
require('utils.js');

var CameraInterface = {
  update: function (dT) {},
  draw: function () {},
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

the camera MUST be attached to a scene before it is made active
*/
Kane.Camera = function (settings) {
  if (!settings.gameBoard) {
    throw new Error('no gameBoard object provided to constructor');
  }

  if (!settings.scene) {
    throw new Error('no scene provided to constructor');
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
  //TODO: implement draw bg, drawmap

  if (this.scene.entityManager && this.gameBoard) {
    drawEntities(this);
  }
};

function drawEntities (camera) {
  //local ref to ents in entityManager
  var ents = camera.scene.entityManager.listEntities()
    , checkCollision = Kane.Utils.checkBBCollision
    , entsToDraw;

  //clear the canvas each draw cycle
  camera.gameBoard.clearAll();

  //loop over all entities and check if they "collide" w/ the camera
  //which means they should be drawn 
  entsToDraw = _(ents).filter(function (ent) {
    return checkCollision(ent, camera);
  });
  
  //if they should be drawn, calculate where they should be drawn
  //subtract their position in the world from the camera's
  _(entsToDraw).each(function (ent, index, ents) {
    
    //attempt to draw currentAnim, currentSprite, or a rect
    if (ent.currentAnimation) {
      var frame = ent.currentAnimation.currentFrame;

      camera.gameBoard.drawSprite(
        {
          image: ent.currentAnimation.image,
          sx: frame.x,
          sy: frame.y,
          h: frame.h,
          w: frame.w,
        },
        ent.x - camera.y,
        ent.y - camera.y,
        ent.w,
        ent.h
      );
    } else if (ent.currentSprite) {
      camera.gameBoard.drawSprite(
        ent.currentSprite,
        ent.x - camera.y,
        ent.y - camera.y,
        ent.w,
        ent.h
      );
    } else {
      camera.gameBoard.drawRect(
        ent.color,
        ent.x - camera.x,
        ent.y - camera.y,
        ent.w,
        ent.h 
      ); 
    }
  });
};

Kane.Camera.prototype.setSize = function (w, h) {
  this.w = w;
  this.h = h;

  //set gameBoard size as well
  this.gameBoard.setSize(w, h);
};
