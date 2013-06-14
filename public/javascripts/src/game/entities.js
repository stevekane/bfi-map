require('entity.js');

Kane.Particle = function (settings) {
  //default settings
  this.lifespan = 600;
  this.killtimer = Date.now() + this.lifespan;
  this.color = "#1382bb";
  this.h = 5;
  this.w = 5; 

  Kane.Entity.call(this, settings);
  this.doesCollide = false;
};

Kane.Particle.prototype = Object.create(Kane.Entity.prototype);

//check kill timer to see if we should kill ourselves
Kane.Particle.prototype.afterUpdate = function (dT) {
  if (Date.now() > this.killtimer) {
    this.kill();
  }
};

Kane.Projectile = function (settings) {
  this.lifespan = 2000;
  this.killtimer = Date.now() + this.lifespan;
  this.color = "#1356ab";
  this.doesCollide = true;
  this.h = 24;
  this.w = 24; 

  Kane.Entity.call(this, settings);
};

Kane.Projectile.prototype = Object.create(Kane.Entity.prototype);

Kane.Projectile.prototype.afterUpdate = function (dT) {
  if (Date.now() > this.killtimer) {
    this.kill();
  }
};

Kane.Projectile.prototype.collide = function (target) {
  //kill ourselves and the target
  this.kill();
  target.kill();

  //spawn "gib" particles
  for (var i=0; i<20; i++) {
    this.manager.spawn(
      Kane.Particle,
      {
        x: this.x,
        y:  this.y,
        dx: Math.random() * (this.dx + target.dx),
        dy: Math.random() * (this.dy + target.dy),
        w: 8,
        h: 8,
        ddy: .001,
      }
    );
  }
};
