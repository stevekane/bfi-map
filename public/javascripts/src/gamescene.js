require('scene.js');

Kane.GameScene = function (settings) {
  Kane.Scene.call(this, settings);

  if (!settings.entityManager) {
    throw new Error('no entityManager provided to constructor');
  }

  if(!settings.inputWizard) {
    throw new Error('no inputWizard provided to constructor');
  }

  //set a default camera
  this.camera = null;

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
  if (!this.camera) {
    throw new Error('no camera defined for this scene!');
  }
  this.camera.draw();
  this.onDraw();
};
