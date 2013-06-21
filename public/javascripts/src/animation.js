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
require('clock.js');

var AnimationInterface = {
  start: function (frameNum) {},
  stop: function () {},
  getCurrentFrame: function () {},

  fps: null,
  frameInterval: null,
  startTime: null
};

Kane.Animation = function (settings) {
  var error;

  if (!settings.image) { error = "no valid image provided"; }
  if (!(settings.frames instanceof Array)) { 
    error = "no frames array provided"; 
  }
  if (error) { throw new Error(error) }

  //SET DEFAULTS FOR INTERFACE ATTRS
  //defines number of frames shown per second
  this.fps = 24;

  //more useful value for determining active frame (ms/frame)
  this.frameInterval = 1 / (this.fps / 1000);

  //capture the time this animation started
  this.startTime = Date.now();

  //this clock instance is used to track animation progress
  this.clock = new Kane.Clock();

  _.extend(this, settings);
};

Kane.Animation.prototype = Object.create(AnimationInterface);

Kane.Animation.prototype.start = function (frameNum) {
  //start our clock
  this.clock.start(); 

  //if frameNum specified, start there else start at 0
  this.currentFrame = frameNum ? this.frames[frameNum] : this.frames[0];
};

Kane.Animation.prototype.stop = function () {
  //stop the clock
  this.clock.stop();   
};

Kane.Animation.prototype.getCurrentFrame = function () {
  return this.currentFrame;  
};
