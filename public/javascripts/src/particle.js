require('entity.js');

//Kane.Particle inherits core behavior from Kane.Entity
Kane.Particle = function (settings) {
  Kane.Entity.call(this, settings);

  //default settings
  this.lifespan = 600;
  this.color = "#1382bb";
  this.h = 5;
  this.w = 5; 

  this.doesCollide = false;

  _.extend(this, settings);
  this.killtimer = Date.now() + this.lifespan;
};

Kane.Particle.prototype = Object.create(Kane.Entity.prototype);

//check kill timer to see if we should kill ourselves
Kane.Particle.prototype.afterUpdate = function (dT) {
  if (Date.now() > this.killtimer) {
    this.kill();
  }
};
