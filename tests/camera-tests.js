minispade.require('camera.js');
minispade.require('drawplane.js');

var assert = chai.assert;

describe("Kane.Camera", function () {
  var c
    , bgPlane 
    , $canvas = $(document.createElement('canvas'));

  $canvas.attr({id: 'bgPlane'});
  $('body').append($canvas);
  
  bgPlane = new Kane.DrawPlane({board: $canvas}); 

  beforeEach(function () {
    c = new Kane.Camera({
      scene: {},
      planes: {
        bgPlane: bgPlane
      }
    });
  });

  it('should be an object', function () {
    assert.isObject(c); 
  });

  it('should throw if no planes provided to constructor', function () {
    assert.throws(function () {
      c = new Kane.Camera({
        scene: {},
      });
    });
  });

  it('should throw if planes object contains no planes', function () {
    assert.throws(function () {
      c = new Kane.Camera({
        scene: {},
        planes: {}
      });
    });
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

  //DRAW METHODS NOT TESTED DUE TO PAIN W/ OBSERVING CONVAS PIXELS
  describe("draw()", function () {
    it('should be a function', function () {
      assert.isFunction(c.draw);
    });
  });

  describe("drawBg()", function () {
    it('should be a function', function () {
      assert.isFunction(c.drawBg);
    });
  });

  describe("drawWorld()", function () {
    it('should be a function', function () {
      assert.isFunction(c.drawWorld);
    });
  });

  describe("drawEntities()", function () {
    it('should be a function', function () {
      assert.isFunction(c.drawEntities);
    });
  });

  describe("#setSize()", function () {
    it('should set the height and width of the camera and its drawplanes', function () {
      var h = 200
        , w = 200;

      c.setSize(w, h);
      assert.equal(c.h, h);
      assert.equal(c.w, w);
      assert.equal(c.planes.bgPlane.getWidth(), w);
      assert.equal(c.planes.bgPlane.getHeight(), h);
    });
  });
});
