minispade.require('drawplane.js');

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

    $canvas = $(document.createElement('canvas'));
    $canvas.attr({id: id});
    $('body').append($canvas);
    canvasInDom = $canvas;
  });

  //get a new instance of Kane.DrawPlane for each test
  beforeEach(function () {
    drawPlane = new Kane.DrawPlane({board: $canvas});
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
    var sx = 0, sy = 0; 

    it('should throw an error if no valid Image provided', function (done) {
      assert.doesNotThrow(function () {
        drawPlane.drawImage(new Image(), sx, sy);
      });
      assert.throws(function () {
        drawPlane.drawImage();
      });
      assert.throws(function () {
        drawPlane.drawImage('image', sx, sy);
      });
      done(); 
    });
  });

  describe("#drawSprite", function () {
    var x = 0
      , y = 0
      , w = 30
      , h = 30
      , sprite = {
          spriteSheet: new Image(),
          sx: 0,
          sy: 0,
          w: 30,
          h: 30 
      }; 

    it('should throw an error if no valid Image provided', function (done) {
      assert.doesNotThrow(function () {
        drawPlane.drawSprite(sprite, x, y, w, h);
      });

      assert.throws(function () {
        drawPlane.drawSprite({}, x, y, w, h);
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
