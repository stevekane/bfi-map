require('kane.js');

Kane.Utils = {
  camel: function (name) {
    var firstChar = name.charAt(0);

    return name.replace(firstChar, firstChar.toLowerCase());
  },
  generateColor: function () {
    return "#" + Math.random().toString(16).slice(2, 8);
  },

  validateColor: function (color) {
    var validColor = /^#[0-9a-f]{3}$|[0-9a-f]{6}$/i;

    return validColor.test(color);
  },

  stripExtension: function (name) {
    return name.slice(0, name.indexOf('.'));
  },

  stripFilePath: function (path) {
    return path.slice(path.lastIndexOf('/') + 1);
  },

  updatePosition: function (dT, v, oldPos) {
    return oldPos + dT * v; 
  },

  updateVelocity: function (dT, a, oldVel) {
    return oldVel + dT * a; 
  },

  checkBBCollision: function (sub, tar) {
    //don't collide with self
    if (sub === tar) { 
      return false; 
    }

    /*
    to clearly visualize this visit
    silentmatt.com/rectangle-intersection/
    */ 
    return ( (sub.x < (tar.x + tar.w)) && 
             ((sub.x + sub.w) > tar.x) &&
             (sub.y < (tar.y + tar.h)) &&
             ((sub.y + sub.h) > tar.y) 
    );
  },
  createCanvas: function (w, h, name) {
    var $canvas = $(document.createElement('canvas'));
    
    $canvas.attr({
      id: name,
      height: h,
      width: w
    }); 
    $('body').append($canvas);
    return $canvas;
  } 
}
