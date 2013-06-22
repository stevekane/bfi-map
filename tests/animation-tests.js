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

    it('should set the current frame to the specified frame or currentFrame', 
    function () {

      anim.start();
      assert.equal(anim.currentFrame, frameOne);
      anim.reset();

      anim.start(1);
      assert.equal(anim.currentFrame, frameTwo);
      assert.equal(anim.currentFrameIndex, 1);
    });
  });

  describe("#stop()", function () {
    it('should be a function', function () {
      assert.isFunction(anim.stop);
    });
    
    it('should reset the currentFrame to the first frame', function () {
      anim.start(1);
      anim.stop();

      assert.equal(anim.currentFrame, frameOne);
      assert.equal(anim.currentFrameIndex, 0);
    });

    it('should set isPlaying to false', function () {
      anim.start();
      anim.stop();

      assert.isFalse(anim.isPlaying);
    });
  });

  describe("#reset()", function () {
    it('should return to the first frame', 
    function () {

      anim.start(1);
      anim.reset();

      assert.equal(anim.currentFrame, frameOne); 
      assert.equal(anim.currentFrameIndex, 0); 
    });
  });

  describe("#updateCurrentFrame()", function () {
    it('should throw if no dT is provided', function () {
      assert.throws(function () {
        anim.updateCurrentFrame();
      });
    });
    it('should change current frame based timeTillNextFrame and dT', 
    function () {
      var timeStep = 10;

      anim.start();
      anim.updateCurrentFrame(timeStep);
      assert.equal(anim.currentFrame, frameOne);
      assert.equal(anim.nextFrameTimeDelta, anim.frameInterval - timeStep);

      anim.updateCurrentFrame(anim.frameInterval);
      assert.equal(anim.nextFrameTimeDelta, anim.frameInterval - timeStep);
      assert.equal(anim.currentFrame, frameTwo);
    });
  });
});
