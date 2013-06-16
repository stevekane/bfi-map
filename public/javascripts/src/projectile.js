require('entity.js');

Kane.Projectile = function (settings) {
  this.lifespan = 2000;
  this.color = "#1356ab";
  this.doesCollide = true;
  this.h = 24;
  this.w = 24; 

  Kane.Entity.call(this, settings);
  this.killtimer = Date.now() + this.lifespan;
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
