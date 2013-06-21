/*
Bullets are fired by towers
*/

require('entity.js');

Test.Bullet = function (settings) {
  Kane.Entity.call(this, settings);

  var cache = this.manager.cache
    , image = cache.getByName('spritesheet.png')
    , data = cache.getByName('spritesheet.json')
             .frames['grapebullet.png']
             .frame;

  //bullets die after this much time has elapsed
  this.killTimer = 1500;
  this.spawnTime = Date.now();

  //set height and width based on data
  this.h = data.h;
  this.w = data.w;
  
  this.ddy = .001;

  //set type
  this.type = 'bullet';

  //fallback color
  this.color = "#b0b0b0";
  //sprite
  this.currentSprite = new Kane.Sprite({
    image: image,
    sx: data.x,
    sy: data.y,
    h: data.h,
    w: data.w,
  });
};

Test.Bullet.prototype = Object.create(Kane.Entity.prototype);

Test.Bullet.prototype.beforeUpdate = function (dT) {
  if (this.spawnTime + this.killTimer < Date.now()) {
    this.kill();
  }
};

Test.Bullet.prototype.afterUpdate = function (dT) {
  for (var i=0; i<5; i++) {
    this.manager.spawn(
      Kane.Particle,
      {
        x: this.x,
        y: this.y + Math.round(Math.random() * this.h),
        dx: Math.random() * -this.dx,
        dy: Math.random() * -this.dy,
        lifespan: 100,
        color: '#dd0000', 
        h: 2 + Math.round(Math.random() *4),
        w: 2 + Math.round(Math.random() * 4) 
      }
    );
  }
};

Test.Bullet.prototype.collide = function (target) {
  if ('player' === target.type) {
    this.kill();
    for (var i=0; i<20; i++) {
      //roll for positive or negative y direction
      var ySign = Math.random() > .5 ? -1 : 1;

      this.manager.spawn(
        Kane.Particle,
        {
          x: this.x + target.w / 2,
          y: this.y + target.h / 2,
          dx: Math.random() * this.dx,
          dy: ySign * Math.random() * this.dy,
          lifespan: 400,
          color: this.color, 
          h: 4,
          w: 4 
        }
      );
    }
  }
};
