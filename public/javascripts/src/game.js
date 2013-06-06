var GameInterface = {
  start: function () {},
  stop: function () {}
};

Kane.Game = function (entityManager, inputQueue) {
  this.entityManager = entityManager;
  this.inputQueue = inputQueue;

  this.isRunning = false;
  this.currentTimeStamp = 0;
  this.previousTimeStamp = 0;
};

Kane.Game.prototype = Object.create(GameInterface); 

//private
Kane.Game.prototype._loop = function () {
  var dT
    , inputs = [];

  //TODO TESTING FOR FPS
  this.fps.begin();
  this.ms.begin();

  //update timestamps
  this.previousTimeStamp = this.currentTimeStamp;
  this.currentTimeStamp = Date.now();

  //calculate deltaT
  dT = this.currentTimeStamp - this.previousTimeStamp;
    
  if (!this.isRunning) { return; }

  //update all entity positions
  this.entityManager.updateActive(dT);
  this.entityManager.updatePlayer(dT);
  //draw all active entities
  this.entityManager.drawActive();
  this.entityManager.drawPlayer();

  //TODO TESTING FOR FPS
  this.fps.end();
  this.ms.end();

  window.requestAnimationFrame(this._loop.bind(this));
};

//public
Kane.Game.prototype.start = function () {
  this.isRunning = true;
  this.currentTimeStamp = Date.now();
  window.requestAnimationFrame(this._loop.bind(this));
  //TESTS FOR FPS MEASUREMENT
  this.fps = createFps();
  this.ms = createMs();
};

Kane.Game.prototype.stop = function () {
  this.currentTimeStamp = 0;
  this.previousTimeStamp = 0;
  this.isRunning = false;
};

//TODO: TESTS FOR FPS MEASUREMENT
function createFps (x, y) {
  var fps = new Stats();
  fps.setMode(0);
  fps.domElement.style.position = 'absolute';
  fps.domElement.style.left = 0;
  fps.domElement.style.top = 0;
  document.body.appendChild(fps.domElement); 
  return fps;
};

function createMs (x, y) {
  var ms = new Stats();
  ms.setMode(1);
  ms.domElement.style.position = 'absolute';
  ms.domElement.style.left = 0;
  ms.domElement.style.top = 50;
  document.body.appendChild(ms.domElement); 
  return ms;
};

