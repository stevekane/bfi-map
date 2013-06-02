var PlayerInterface = {
  move: function () {},
  getYVelocity: function () {},
  getJumpVelocity: function () {},
  jump: function () {},
  duck: function () {}
};

Kane.Player = function () {
  this.isJumping = false;
  this.isDucking = false;
  this.yVelocity = 0;
  this.height = 60;
  this.y = 0 + this.height;

  this.jumpVelocity = 20; 
  this.duckDuration = 700;
  this.grav = -5;
};

Kane.Player.prototype = Object.create(PlayerInterface);

//timeDelta is in seconds
Kane.Player.prototype.move = function (timeDelta) {
  var newHeight;

  if (null === timeDelta) { 
    throw new Error('no timeDelta provided to move');
  }
  if ('number' !== typeof(timeDelta)) {
    throw new Error('move must be provided a numerical timeDelta');
  }
  //calculate new position
  newHeight = calcPos(timeDelta, this.yVelocity, this.y, this.grav);
  newHeight = (newHeight < this.height) ? this.height : newHeight;
  this.y = newHeight; 
  console.log(this.y);
};

Kane.Player.prototype.getYVelocity = function () {
  return this.yVelocity;
};

Kane.Player.prototype.getJumpVelocity = function () {
  return this.jumpVelocity;
};

Kane.Player.prototype.jump = function () {
  //do nothing if player is not on the ground
  if (this.yVelocity !== 0) { return; }

  this.isJumping = true;
  this.yVelocity = this.yVelocity + this.jumpVelocity;
};

Kane.Player.prototype.duck = function () {
  if (this.isDucking) { return; } 
  if (this.isJumping) { return; }

  this.isDucking = true;
  window.setTimeout(function () {
    this.isDucking = false;    
  }.bind(this), this.duckDuration);
};

function calcPos (dT, vel, pos, accel) {
  return (.5 * accel * dT * dT + vel * dT + pos);
};
