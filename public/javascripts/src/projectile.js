require('entity.js');

//Kane.Projectile inherits core behavior from Kane.Entity
Kane.Projectile = function (settings) {

  Kane.Entity.call(this, settings);

  this.h = 24;
  this.w = 24; 
  this.color = "#00bb22";

  this.lifespan = 2000;
  this.doesCollide = true;

  this.killtimer = Date.now() + this.lifespan;

  _.extend(this, settings);
};

Kane.Projectile.prototype = Object.create(Kane.Entity.prototype);

Kane.Projectile.prototype.afterUpdate = function (dT) {
  if (Date.now() > this.killtimer) {
    this.kill();
  }
};

Kane.Projectile.prototype.collide = function (target) {
  //kill ourselves
  this.kill();

  //spawn "gib" particles
  for (var i=0; i<20; i++) {
    this.manager.spawn(
      Kane.Particle,
      {
        x: this.x,
        y: this.y,
        dx: Math.random() * (this.dx + target.dx),
        dy: Math.random() * (this.dy + target.dy),
        w: 3,
        h: 3,
        ddy: .001,
      }
    );
  }
};
