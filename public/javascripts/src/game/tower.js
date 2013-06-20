/*
Towers are entities that never move but will
shoot projectiles at the player every so often
*/
require('entity.js');

Test.Tower = function (settings) {
  Kane.Entity.call(this, settings);

  var cache = this.manager.cache
    , image = cache.getByName('spritesheet.png')
    , data = cache.getByName('spritesheet.json')
             .frames['appletower.png']
             .frame;

  //fallback color
  this.color = "#123654";
  this.currentSprite = new Kane.Sprite({
    image: image,
    sx: data.x,
    sy: data.y,
    h: data.h,
    w: data.w
  });

  //set height and width based on data
  this.h = data.h;
  this.w = data.w;

  //set type
  this.type = 'tower';

  //for the time being, towers do not collide
  this.doesCollide = false;

  //time between shots
  this.shotTimer = 1000;
  this.lastShot = 0; 
  this.bulletSpeed = .5;
};

Test.Tower.prototype = Object.create(Kane.Entity.prototype);

//our tower will check if it should shoot
Test.Tower.prototype.beforeUpdate = function (dT) {
  var currentTime = Date.now();

  if (!this.target) {
    this.target = getTarget(this);
  } 

  if (currentTime > this.lastShot+this.shotTimer) {
    var trajectory = findTrajectory(this, this.target);

    //set lastShot time to now
    this.lastShot = currentTime;
     
    fireBullet(this, trajectory);
    //vary the shot timer
    this.shotTimer = generateShotTimer(this);
  }
};

//return object w/ x/y
function findTrajectory (tower, target) {
  var xComp = target.x - tower.x
    , yComp = target.y - tower.y
    //TODO: this could be optimized
    length = Math.sqrt(xComp*xComp + yComp*yComp); 

  //return normalized trajectory
  return {
    x: xComp/length,
    y: yComp/length 
  }; 
};

function fireBullet (tower, trajectory) {
  tower.manager.spawn(
    Test.Bullet,
    {
      x: tower.x + tower.w,
      y: tower.y,
      dx: trajectory.x * tower.bulletSpeed,
      dy: trajectory.y * tower.bulletSpeed
    }
  );
};

function getTarget(tower) {
  return tower.manager.player ? tower.manager.player : null;
};

function generateShotTimer (tower) {
  return 1000 + Math.random() * 2000;
};
