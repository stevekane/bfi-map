require('kane.js');

var DrawPlaneInterface = {
  fillAll: function (hexColor) {},
  drawRect: function (color, x, y, w, h) {},
  drawImage: function (image, sx, sy, sw, sh, x, y, w, h) {},
  clearAll: function () {}
};

Kane.DrawPlane = function (settings) {
  if (!settings.board) { 
    throw new Error('must provide canvas domnode'); 
  }

  _.extend(this, settings);
  this.ctx = this.board.getContext('2d');
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
    h);
};

Kane.DrawPlane.prototype.drawImage = function (image, sx, sy) {
  var isValidImage = image instanceof Image;

  if (!isValidImage) { 
    throw new Error('not a valid image!'); 
  }

  this.ctx.drawImage(
    image, 
    Math.round(sx), 
    Math.round(sy)
  );
};

Kane.DrawPlane.prototype.clearAll = function () {
  this.ctx.clearRect(0, 0, this.board.width, this.board.height);
};
