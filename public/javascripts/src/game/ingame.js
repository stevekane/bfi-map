require('scene.js');
require('game/player.js');

//define our 'ingame scene'
Test.Ingame = function (settings) {
  Kane.Scene.call(this, settings);
};

//again, we set the prototype to Kane.Scene's prototype
Test.Ingame.prototype = Object.create(Kane.Scene.prototype);

Test.Ingame.prototype.init = function (settings) {
  //setup an entityManager
  this.entityManager = new Kane.EntityManager({
    cache: this.cache
  });  
  this.gameBoard = new Kane.DrawPlane({
    board: $('#gameboard')
  });
  this.camera = new Kane.Camera({
    scene: this,
    gameBoard: this.gameBoard,
    h: document.height,
    w: document.width
  }); 
};

Test.Ingame.prototype.onEnter = function () {
  console.log('game entered!');

  if (!this.entityManager.player) {
    this.entityManager.player = 
      this.entityManager.spawn(
      Test.Player, 
      {
        x: 100,
        y: 100,
      }
    );
  }
};

Test.Ingame.prototype.update = function (dT) {
  if (!dT) { 
    throw new Error('no dT provided to update'); 
  }

  this.entityManager.removeDead();
  this.entityManager.sortBy('zIndex'); 
  this.entityManager.updateAll(dT);  
  this.onUpdate(dT);
};

Test.Ingame.prototype.draw = function () {
  this.camera.draw();
  this.onDraw();
};

Test.Ingame.onUpdate = function (dT) {
  
};
