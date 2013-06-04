var GameInterface = {
  start: function () {},
  stop: function () {}
};

Kane.Game = function (entityManager) {
  this.isRunning = false;
  this.entityManager = entityManager;
  this.currentTimeStamp = 0;
  this.previousTimeStamp = 0;
};

Kane.Game.prototype = Object.create(GameInterface); 

//private
Kane.Game.prototype._loop = function () {
  var dT;

  //update timestamps
  this.previousTimeStamp = this.currentTimeStamp;
  this.currentTimeStamp = Date.now();

  //calculate deltaT
  dT = this.currentTimeStamp - this.previousTimeStamp;
    
  if (!this.isRunning) { return; }

  //update all entity positions
  this.entityManager.updateActive(dT);
  //draw all active entities
  this.entityManager.drawActive();

  window.requestAnimationFrame(this._loop.bind(this));
};

//public
Kane.Game.prototype.start = function () {
  this.isRunning = true;
  this.currentTimeStamp = Date.now();
  window.requestAnimationFrame(this._loop.bind(this));
};

Kane.Game.prototype.stop = function () {
  this.currentTimeStamp = 0;
  this.previousTimeStamp = 0;
  this.isRunning = false;
};
