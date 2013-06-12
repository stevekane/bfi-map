minispade.require('main.js');

var assert = chai.assert;

describe('Kane.DrawPlane', function () {
  var drawPlane
    , canvasInDom;

  it('should throw if no valid canvas provided', function () {
    assert.throws(function () {
      new Kane.DrawPlane();
    });
  });
  
  before(function () {
    var id = "testcan";

    canvas = document.createElement('canvas');
    canvas.id = id;
    document.body.appendChild(canvas);
    canvasInDom = document.getElementById(id);
  });

  //get a new instance of Kane.DrawPlane for each test
  beforeEach(function () {
    drawPlane = new Kane.DrawPlane({board: canvasInDom});
  });
  
  it('should create a new object', function () {
    assert.isObject(drawPlane);
  });

  //we don't test rendering as it is totally painful
  describe("#fillAll()", function () {
    var color = "#123456";

    it('should run without error', function () {
      assert.doesNotThrow(function () {
        drawPlane.fillAll(color);
      });
    });
    
    it('should set the fillstyle of ctx to input color', function () {
      var ctxColor;

      drawPlane.fillAll(color);
      ctxColor = drawPlane.ctx.fillStyle;
      assert.equal(
        color, 
        ctxColor, 
        "ctx fill color same as input color"
      );
    });

    it('should throw if provided a non-hex input', function () {
      assert.throws(function () {
        drawPlane.fillAll('blorp', TypeError);
      });
    });
  });  
  
  describe("#drawRect", function () {
    var color = "#aabbcc" 
      , x = 0, y = 0, w = 1, h = 1;

    it('should run without error', function () {
      assert.doesNotThrow(function () {
        drawPlane.drawRect(color, x, y, w, h);
      });
    });
    
    it('should set the fillstyle of ctx to input color', function () {
      var ctxColor;

      drawPlane.drawRect(color, x, y, w, h);
      ctxColor = drawPlane.ctx.fillStyle;
      assert.equal(color, ctxColor, "ctx fill color same as input color");
    });

    it('should throw if provided a non-hex input', function () {
      assert.throws(function () {
        drawPlane.fillAll('blorp');
      });
    });
  });

  describe("#drawImage", function () {
    var sx = 0, sy = 0, sw = 1, sh = 1
      , x = 0, y = 0, w = 1, h = 1;

    it('should throw an error if no valid Image provided', function (done) {
      assert.doesNotThrow(function () {
        drawPlane.drawImage(new Image(), sx, sy, sw, sh, x, y, w, h);
      });
      assert.throws(function () {
        drawPlane.drawImage();
      });
      assert.throws(function () {
        drawPlane.drawImage('image', sx, sy, sw, sh, x, y, w, h);
      });
      done(); 
    });
  });

  //we don't test the functionality for ease
  describe("#clearAll", function () {
    it('should run without error', function () {
      assert.doesNotThrow(function () {
        drawPlane.clearAll();
      });
    });
  });

});
