minispade.require('camera.js');

var assert = chai.assert;

describe("Kane.Camera", function () {
  var c;

  beforeEach(function () {
    c = new Kane.Camera();
  });

  it('should be an object', function () {
    assert.isObject(c); 
  });

  describe("update()", function () {
    it('should be a function', function () {
      assert.isFunction(c.update);
    });

    it('should update the position and velocity for x and y', function () {
      var dT = 100
        , expectedVelx
        , expectedVely
        , expectedPosx
        , expectedPosy;

      c.x = 0;
      c.dx = 1;
      c.ddx = 1;
      c.y = 0;
      c.dy = 1;
      c.ddy = 1;
    
      expectedPosx = c.x + dT * c.dx;
      expectedPosy = c.y + dT * c.dy;
      expectedVelx = c.dx + dT * c.ddx;
      expectedVely = c.dy + dT * c.ddy;

      //perform update
      c.update(dT);

      assert.equal(c.x, expectedPosx);
      assert.equal(c.y, expectedPosy);
      assert.equal(c.dx, expectedVelx);
      assert.equal(c.dy, expectedVely);
    });
  });
});
