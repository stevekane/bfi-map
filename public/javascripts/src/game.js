var GameInterface = {
  start: function () {},
  stop: function () {}
};

Kane.Game = function (entityManager) {
  this.isRunning = false;
  this.entityManager = entityManager;
};

Kane.Game.prototype = Object.create(GameInterface); 

//private
Kane.Game.prototype._loop = function () {
  if (!this.isRunning) { return; }

  //update all entity positions
  //scroll the background
  //play sounds?
  window.requestAnimationFrame(this._loop.bind(this));
};

//public
Kane.Game.prototype.start = function () {
  this.isRunning = true;
  window.requestAnimationFrame(this._loop.bind(this));
};

Kane.Game.prototype.stop = function () {
  this.isRunning = false;
};
