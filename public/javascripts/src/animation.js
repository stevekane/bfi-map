/*
An Animation should define the x, y, w, h of each frame that is found 
on a provided spritesheet (Kane.Image).  

when an animation is running the following happens:

determine if the frametime for the current frame has elapsed
If so, it should advance to the next frame
if not, it should re-render the current frame

if the frame being rendered is the last frame, it should check
the 'shouldLoop' flag to determine if it should go to the first frame
or simply stop

To create an animation, you must provide an instance of an Image
and an array of Kane.Frames
*/


require('kane.js');
require('frame.js');

var AnimationInterface = {
  start: function (frameNum) {},
  stop: function () {},
  reset: function () {},
  updateCurrentFrame: function (dT) {},

  //interface attributes
  fps: null,
  frameInterval: null,
  currentFrame: null,
  currentFrameIndex: null,
  isPlaying: false,
  shouldLoop: false
};

/**
fps: frames per second
frameInterval: inverse of fps converted to ms
isPlaying: boolean for playing status of this animation
currentFrame: tracks the current active frame
startTime: time of most recent start call
startingFrame: frame that animation started from
nextFrameTimeDelta: timestamp that is updated by each update call
                    which tells the game when it should transition
                    to the next frame

*/

Kane.Animation = function (settings) {
  var error;

  if (!settings.image) { error = "no valid image provided"; }
  if (!(settings.frames instanceof Array)) { 
    error = "no frames array provided"; 
  }
  if (error) { throw new Error(error) }

  this.fps = 24;
  this.shouldLoop = false;

  _.extend(this, settings);

  //calc these after the parsing the settings
  this.isPlaying = false;  
  this.frameInterval = 1 / (this.fps / 1000);
  this.currentFrame = this.frames[0];
  this.currentFrameIndex = 0;
  this.startTime = null;
  this.startingFrame = this.currentFrame;
  this.nextFrameTimeDelta = null;
};

Kane.Animation.prototype = Object.create(AnimationInterface);

Kane.Animation.prototype.start = function (frameNum) {
  this.startTime = Date.now();
  //TODO: in the future, possbly include a duration attr on frames
  //and use that attr to calculate nextFrameTimeDelta
  this.nextFrameTimeDelta = this.frameInterval;
  this.isPlaying = true;

  //if frameNum specified, start there else start at 0
  if (null !== frameNum && undefined !== frameNum) {
    this.currentFrame = this.frames[frameNum];
    this.currentFrameIndex = frameNum;
  } 

  this.startingFrame = this.currentFrame;
};

//stop playing and reset to first frame
Kane.Animation.prototype.stop = function () {
  this.currentFrame = this.frames[0];
  this.currentFrameIndex = 0;
  this.isPlaying = false;
};

//resets the anim and resumes playing (alias for stop/start())
Kane.Animation.prototype.reset = function () {
  this.stop();
  this.start();
};

/*
Here we use the startingFrame, startingTime, and a 
Date.now to compute what frame we should be showing
*/
Kane.Animation.prototype.updateCurrentFrame = function (dT) {
  var nextFrame
    , overshoot;
    
  if (undefined === dT || null === dT) {
    throw new Error('no dT provided to updateCurrentFrame');
  } 

  //if we are not playing, do nothing
  if (!this.isPlaying) {
    return; 
  }

  //calculate how much we overshot the next transition
  overshoot = dT - this.nextFrameTimeDelta;
 
  //we use this expression instead of overshoot > 0 because it's clearer
  if (dT >= this.nextFrameTimeDelta) {

    //is this the last frame?
    if (this.currentFrameIndex === this.frames.length - 1) {

      //if we shouldn't loop, animation is done
      if (!this.shouldLoop) { 
        this.stop(); 

      //otherwise, set next frame/index and 
      //calculate nextFrameTimeDelta
      } else {
        this.currentFrame = this.frames[0];
        this.currentFrameIndex = 0;
        this.nextFrameTimeDelta = this.frameInterval - overshoot;
      }
    
    //if not last frame, advance 1 frame
    } else {
      this.currentFrame = this.frames[this.currentFrameIndex + 1];
      this.currentFrameIndex = this.currentFrameIndex + 1;
      this.nextFrameTimeDelta = this.frameInterval - overshoot;
    }
  
  //if not enough time has passed, just update the nextFrameTimeDelta
  } else {
    this.nextFrameTimeDelta = this.nextFrameTimeDelta - dT;
  }
};

