minispade.require('camera.js');
minispade.require('drawplane.js');

var assert = chai.assert;

describe("Kane.Camera", function () {
  var c
    , $canvas = $(document.createElement('canvas'));

  $canvas.attr({id: 'gameboard'});
  $('body').append($canvas);
  
  gameBoard = new Kane.DrawPlane({board: $canvas}); 

  beforeEach(function () {
    c = new Kane.Camera({
      scene: {},
      gameBoard: gameBoard
    });
  });

  it('should be an object', function () {
    assert.isObject(c); 
  });

  it('should throw if no gameboard provided to constructor', function () {
    assert.throws(function () {
      c = new Kane.Camera({
        scene: {},
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

  describe("#setSize()", function () {
    it('should set the height/width of the camera and gameBoard', function () {
      var h = 200
        , w = 200;

      c.setSize(w, h);
      assert.equal(c.h, h);
      assert.equal(c.w, w);
      assert.equal(c.gameBoard.getWidth(), w);
      assert.equal(c.gameBoard.getHeight(), h);
    });
  });
});
