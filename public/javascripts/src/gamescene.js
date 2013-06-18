require('scene.js');

Kane.GameScene = function (settings) {
  Kane.Scene.call(this, settings);

  if (!settings.entityManager) {
    throw new Error('no entityManager provided to constructor');
  }

  if (!settings.camera) {
    throw new Error('no camera provided to constructor');
  }

  _.extend(this, settings);
};

Kane.GameScene.prototype = Object.create(Kane.Scene.prototype);

Kane.GameScene.prototype.update = function (dT) {
  if (!dT) { 
    throw new Error('no dT provided to update'); 
  }

  this.entityManager.removeDead();
  this.entityManager.sortBy('zIndex'); 
  this.entityManager.updateAll(dT);  
  this.onUpdate(dT);
};

Kane.GameScene.prototype.draw = function () {
  this.camera.draw();
  this.onDraw();
};
