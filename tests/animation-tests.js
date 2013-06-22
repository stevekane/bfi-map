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

    describe("the case when the  frame shouldnot advance", function () {
      it('should keep the same frame as before the update', function () {
        var frameBefore
          , frameAfter;

        anim.start();
        frameBefore = anim.currentFrame;
        //default time interval for animatiosn is 41.6 ms
        anim.updateCurrentFrame(10);        
        frameAfter = anim.currentFrame;
        assert.equal(frameBefore, frameAfter);
      });
    });

    describe("the case when the frame should not advance", function () {
      it('should not change the currentFrame', function () {
        var frameBefore
          , indexBefore
          , frameAfter
          , indexAfter;

        anim.start();
        frameBefore = anim.currentFrame;
        indexBefore = anim.currentFrameIndex;
        //provide dT that is smaller than required frameInterval(41.6)
        anim.updateCurrentFrame(10); 
        frameAfter = anim.currentFrame;
        indexAfter = anim.currentFrameIndex;
        assert.equal(frameAfter, frameBefore);
        assert.equal(indexAfter, indexBefore);
      });
    });
    describe("the case when the frame should advance", function () {
      describe("the case when the currentFrame is last frame", function () {
        describe("the case when shouldLoop is false", function () {
          it('should stop the animation and reset the current frame', 
          function () {
            anim.shouldLoop = false;
            //start at last frame
            anim.start(1); 
            //provide a dT larger than the frameInterval (41.6)
            anim.updateCurrentFrame(50);
            
            assert.equal(frameOne, anim.currentFrame);
            assert.equal(0, anim.currentFrameIndex);
            assert.isFalse(anim.isPlaying);
          });
        });

        describe("the case when shouldLoop is true", function () {
          it('should reset the current frame and keep playing', function () {
            anim.shouldLoop = true;
            //start at last frame
            anim.start(1);
            //provide dT larger than the frameInterval (41.6)
            anim.updateCurrentFrame(50);
            
            assert.equal(frameOne, anim.currentFrame);
            assert.equal(0, anim.currentFrameIndex);
            assert.isTrue(anim.isPlaying);
          });
        });
      });
      
      describe('the case when the currentSlide is NOT the last frame',
      function () {
        it('should advance the frame and frame index by 1', function () {
          //start anim at first frame
          anim.start();
          //provide dT larger than frameInterval (41.6)
          anim.updateCurrentFrame(50);
          
          assert.equal(frameTwo, anim.currentFrame);
          assert.equal(1, anim.currentFrameIndex); 
          assert.isTrue(anim.isPlaying);
        });
      });
    });
  });
});
