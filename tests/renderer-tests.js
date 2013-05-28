minispade.require('main.js');

var assert = chai.assert;

describe('Kane.Renderer', function () {
  var renderer;
  
  //get a new instance of Kane.Renderer for each test
  beforeEach(function () {
    renderer = new Kane.Renderer();
  });
  
  it('should create a new object', function () {
    assert.isObject(renderer);
  });

  describe("#getCtx()", function () {
    it('should expose a context object', function () {
      assert.isObject(renderer.getCtx(), "context object available");
    });
  }); 

  describe("#getBoard()", function () {
    it('should return the canvas board element', function () {
      assert.isObject(renderer.getBoard(), "board object available");
    });
  });

  describe("#setHeight()", function () {
    it('should set height of canvas id=board', function (done) {
      var height = 300;

      renderer.setHeight(height);
      assert.equal(
        renderer.getBoard().height, 
        height, 
        "height matches set value"
      );       
      done();
    }); 
  });

  describe("#getHeight()", function () {
    it('should get the height of the canvas element', function (done) {
      assert.equal(
        renderer.getHeight(),
        renderer.getBoard().height,
        "height matches board domnode's height"
      );
      done();
    });
  });

  describe("#setWidth()", function () {
    it('should set width of canvas id=board', function (done) {
      var width = 300;

      renderer.setWidth(width);
      assert.equal(
        renderer.getBoard().width, 
        width, 
        "width matches set value"
      );       
      done();
    }); 
  });

  describe("#getWidth()", function () {
    it('should get the width of the canvas element', function (done) {
      assert.equal(
        renderer.getWidth(),
        renderer.getBoard().width,
        "width matches board domnode's width"
      );
      done();
    });
  });

});
