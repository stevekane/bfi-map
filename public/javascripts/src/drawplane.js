/*
drawplane is responsible for drawing the main gamespace
*/
Kane.DrawPlane = function (canvas) {
  this.board = canvas;
};

Kane.DrawPlane.prototype = (function () {

  var board = document.getElementById('board')
    , ctx;

  //private
  //create new board object if none defined
  var _createBoard = function (name) {
    var newBoard = document.createElement('canvas');

    newBoard.id = name;
    document.body.appendChild(newBoard); 
    return document.getElementById(name);
  };

  //helper method for drawing
  var _validateColor = function (color) {
    var validColor = /^#[0123456789abcdef]*$/i;
    return color.match(validColor);  
  };

  if (board === null) {
    board = _createBoard("board"); 
  }
  
  board.height = 200;
  board.width = 200;

  ctx = board.getContext('2d');

  //public
  var getCtx = function () {
    return ctx;
  };

  var getBoard = function () {
    return board;
  };

  var setHeight = function (height) {
    board.height = height;
  };

  var getHeight = function () {
    return board.height;
  };

  var setWidth = function (width) {
    board.width = width;
  };

  var getWidth = function () {
    return board.width;
  };

  //this method will fill the entire board with a solid color
  var fillAll = function (color) {
    drawRect(color, 0, 0, board.width, board.height);
  };

  //draw rect w/ provided location/dimesions
  var drawRect = function (color, x, y, width, height) {
    if (!_validateColor(color)) { 
      throw new TypeError('invalid color'); 
      return;
    }
    //color must be valid hex
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };

  var clearAll = function () {
    ctx.clearRect(0, 0, board.width, board.height);
  };

  return {
    getCtx: getCtx,
    getBoard: getBoard,
    setHeight: setHeight,
    getHeight: getHeight,
    setWidth: setWidth,
    getWidth: getWidth,

    fillAll: fillAll,
    drawRect: drawRect,
    clearAll: clearAll 
  };

})();
