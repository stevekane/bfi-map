minispade.require('main.js');

var assert = chai.assert;

describe('Kane.DrawPlane', function () {
  var drawPlane;
  
  //get a new instance of Kane.DrawPlane for each test
  beforeEach(function () {
    drawPlane = new Kane.DrawPlane();
  });
  
  it('should create a new object', function () {
    assert.isObject(drawPlane);
  });

  describe("#getCtx()", function () {
    it('should expose a context object', function () {
      assert.isObject(drawPlane.getCtx(), "context object available");
    });
  }); 

  describe("#getBoard()", function () {
    it('should return the canvas board element', function () {
      assert.isObject(drawPlane.getBoard(), "board object available");
    });
  });

  describe("#setHeight()", function () {
    it('should set height of canvas id=board', function (done) {
      var height = 300;

      drawPlane.setHeight(height);
      assert.equal(
        drawPlane.getBoard().height, 
        height, 
        "height matches set value"
      );       
      done();
    }); 
  });

  describe("#getHeight()", function () {
    it('should get the height of the canvas element', function (done) {
      assert.equal(
        drawPlane.getHeight(),
        drawPlane.getBoard().height,
        "height matches board domnode's height"
      );
      done();
    });
  });

  describe("#setWidth()", function () {
    it('should set width of canvas id=board', function (done) {
      var width = 300;

      drawPlane.setWidth(width);
      assert.equal(
        drawPlane.getBoard().width, 
        width, 
        "width matches set value"
      );       
      done();
    }); 
  });

  describe("#getWidth()", function () {
    it('should get the width of the canvas element', function (done) {
      assert.equal(
        drawPlane.getWidth(),
        drawPlane.getBoard().width,
        "width matches board domnode's width"
      );
      done();
    });
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
      ctxColor = drawPlane.getCtx().fillStyle;
      assert.equal(color, ctxColor, "ctx fill color same as input color");
    });

    it('should throw if provided a non-hex input', function () {
      assert.throws(function () {
        drawPlane.fillAll('blorp', TypeError);
      });
    });
  });  
  
  describe("#drawRect", function () {
    var color = "#aabbcc" 
      , x = 0
      , y = 0
      , w = 1
      , h = 1;

    it('should run without error', function () {
      assert.doesNotThrow(function () {
        drawPlane.drawRect(color, x, y, w, h);
      });
    });
    
    it('should set the fillstyle of ctx to input color', function () {
      var ctxColor;

      drawPlane.drawRect(color, x, y, w, h);
      ctxColor = drawPlane.getCtx().fillStyle;
      assert.equal(color, ctxColor, "ctx fill color same as input color");
    });

    it('should throw if provided a non-hex input', function () {
      assert.throws(function () {
        drawPlane.fillAll('blorp', TypeError);
      });
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
