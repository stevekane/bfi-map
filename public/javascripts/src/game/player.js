/*
One player object is created when the scene is entered
The player respawns to input from keyboard and mouse
*/

require('entity.js');

Test.Player = function (settings) {
  Kane.Entity.call(this, settings);

  var cache = this.manager.cache
    , image = cache.getByName('spritesheet.png')
    , data = cache.getByName('spritesheet.json')
             .frames['banana-antidude.png']
             .frame;

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
