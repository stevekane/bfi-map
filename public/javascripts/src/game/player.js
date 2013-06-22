/*
One player object is created when the scene is entered
The player respawns to input from keyboard and mouse
*/

require('entity.js');

/*
TODO:
used to build animations.  This needs to be moved almost
certainly to some sort of animation sheet object
*/
function buildAnimation (cache, image, json, frameNames) {
  var frames = [];

  for (var i=0; i<frameNames.length; i++) {
    var frameName = frameNames[i];
    var data = cache.getByName(json).frames[frameName].frame;

    frames.push(
      new Kane.Frame({
        x: data.x,
        y: data.y,
        w: data.w,
        h: data.h
      })
    );   
  }

  return new Kane.Animation({
    image: cache.getByName(image),
    frames: frames,
    shouldLoop: true,
    fps: 1 
  });
};

Test.Player = function (settings) {
  Kane.Entity.call(this, settings);

  var cache = this.manager.cache
    , image = cache.getByName('spritesheet.png')
    , data = cache.getByName('spritesheet.json')
             .frames['banana-antidude.png']
             .frame;

  this.currentAnimation = buildAnimation(
    this.manager.cache,
    'spritesheet.png',
    'spritesheet.json',
    [
      'grape-antidude.png', 
      'grape-antitower.png', 
      'grape-antibase.png'
    ]
  );

  //start the currentAnimation
  this.currentAnimation.start();

  //set height and width based on data
  this.h = data.h;
  this.w = data.w;
  
  //set type
  this.type = 'player';
  
  //set moveSpeed
  this.moveSpeed = .3;

  //fallback color
  this.color = "#bbbbbb";
  //sprite
  this.currentSprite = new Kane.Sprite({
    image: image,
    sx: data.x,
    sy: data.y,
    h: data.h,
    w: data.w
  });
};

Test.Player.prototype = Object.create(Kane.Entity.prototype);

Test.Player.prototype.beforeUpdate = function (dT) {
  //update the animationsheet
  if (this.currentAnimation) {
    this.currentAnimation.updateCurrentFrame(dT);
  }
};
