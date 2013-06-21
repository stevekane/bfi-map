Test.Stream = function (settings) {
  Kane.Particle.call(this, settings);
};

Test.Stream.prototype = Object.create(Kane.Particle.prototype);

Test.Stream.prototype.collide = function (target) {
  if ('player' === target.type) {
    this.kill();
    for (var i=0; i<30; i++) {
      this.manager.spawn(
        Kane.Particle,
        {
          x: this.x,
          y: this.y,
          dx: -this.dx / 2 * Math.random(),
          dy: -.25 * Math.random(),
          color: "#bbbb00",
          h: 2,
          w: 2,
          ddy: .001,
          doesCollide: false
        } 
      );
    }
  }
};
