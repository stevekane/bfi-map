minispade.require('animation.js');
minispade.require('frame.js');

var assert = chai.assert;


describe("Kane.Animation", function () {
  var anim
    , frameOne = {
        x: 0, y: 0, h: 10, w: 10
    }
    , frameTwo = {
        x: 10, y: 10, h: 10, w: 10
    };

  beforeEach(function () {
    anim = new Kane.Animation({
      image: new Image(),
      frames: [frameOne, frameTwo]
    });
  }); 

  it('should return an object', function () {
    assert.isObject(anim);          
  });

  it('should throw if no Image provided', function () {
    assert.throws(function () {
      anim = new Kane.Animation({});
    });
  });
  
  it('should throw if provided not provided array called frames', function () {
    assert.throws(function () {
      anim = new Kane.Animation({
        image: new Image()
      });
    });
    assert.throws(function () {
      anim = new Kane.Animation({
        image: new Image(),
        frames: {}
      });
    });
  });
  
  describe("#start()", function () {
    it('should be a function', function () {
      assert.isFunction(anim.start);
    });

    it('should set the current frame to the specified frame or 0', function () {
      var currentFrame;

      anim.start();
      currentFrame = anim.getCurrentFrame();       
      assert.equal(currentFrame, frameOne);

      anim.start(1);
      currentFrame = anim.getCurrentFrame();       
      assert.equal(currentFrame, frameTwo);
    });
  });

  describe("#stop()", function () {
    it('should be a function', function () {
      assert.isFunction(anim.stop);
    });
  });

  describe("#getCurrentFrame()", function () {
    it('should be a function', function () {
      assert.isFunction(anim.getCurrentFrame);
    });
  });
});
