require('kane.js');

var DrawPlaneInterface = {
  fillAll: function (hexColor) {},
  drawRect: function (color, x, y, w, h) {},
  drawImage: function (image, sx, sy, sw, sh, x, y, w, h) {},
  drawSprite: function (sprite, x, y, w, h) {},
  clearAll: function () {},
  setSize: function (w, h) {},
  getWidth: function () {},
  getHeight: function () {},
};

Kane.DrawPlane = function (settings) {
  if (!settings.board) { 
    throw new Error('must provide canvas domnode'); 
  }
  

  _.extend(this, settings);

  //set initial size of canvas
  this.setSize(
    settings.w || 640,
    settings.h || 480
  );

  //set the drawing context for the board
  this.ctx = this.board[0].getContext('2d');
};

Kane.DrawPlane.prototype = Object.create(DrawPlaneInterface);

//this method will fill the entire board with a solid color
Kane.DrawPlane.prototype.fillAll = function (color) {
  this.drawRect(color, 0, 0, this.board.width, this.board.height);
};

//draw rect w/ provided location/dimesions
Kane.DrawPlane.prototype.drawRect = function (color, x, y, w, h) {
  if (!Kane.Utils.validateColor(color)) { 
    throw new TypeError('invalid color'); 
  }
  //color must be valid hex
  this.ctx.fillStyle = color;
  this.ctx.fillRect(
    Math.round(x), 
    Math.round(y), 
    w, 
    h
  );
};

Kane.DrawPlane.prototype.drawImage = function (image, x, y) {
  var isValidImage = image instanceof Image;

  if (!isValidImage) { 
    throw new Error('not a valid image!'); 
  }

  this.ctx.drawImage(
    image, 
    Math.round(x), 
    Math.round(y)
  );
};

Kane.DrawPlane.prototype.drawSprite = function (sprite, x, y, w, h) {
  var isValidImage = sprite.spriteSheet instanceof Image;

  if (!isValidImage) { 
    throw new Error('sprite.spriteSheet is not a valid image!'); 
  }

  this.ctx.drawImage(
    sprite.spriteSheet,
    sprite.sx,
    sprite.sy,
    sprite.w,
    sprite.h,
    Math.round(x),
    Math.round(y),
    w,
    h
  );
};

Kane.DrawPlane.prototype.clearAll = function () {
  this.ctx.clearRect(
    0, 
    0, 
    this.board.attr('width'), 
    this.board.attr('height')
  );
};

Kane.DrawPlane.prototype.setSize = function (w, h) {
  //set size of the canvas element
  this.board.attr({
    width: w || 640,
    height: h || 480
  }); 
};

Kane.DrawPlane.prototype.getHeight = function () {
  return this.board.attr('height');
};

Kane.DrawPlane.prototype.getWidth = function () {
  return this.board.attr('width');
};
