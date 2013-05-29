/*
drawplane is responsible for drawing the main gamespace
*/
Kane.DrawPlane = function () {};

Kane.DrawPlane.prototype = (function () {

  var board
    , ctx;

  //private
  //helper method for drawing
  var _validateColor = function (color) {
    var validColor = /^#[0123456789abcdef]*$/i;
    return color.match(validColor);  
  };

  //creates new canvas and attaches it to target of DOM
  var _createBoard = function (name, target) {
    var boardEl = document.createElement('canvas');
    boardEl.id = name;
    target.appendChild(boardEl);
    return document.getElementById(name);
  };

  //public
  var getCtx = function () {
    return ctx;
  };

  var setBoard = function (name, target) {
    if (!name) { throw new Error('no name provided to setBoard'); }
    if (typeof(name) !== "string") { throw new Error('name must be string!'); }

    var existingBoard = document.getElementById(name)
      , boardInDom;

    //if no target provided, use document.body
    target = (target) ? target : document.body;
    boardInDom = (existingBoard) ? existingBoard : _createBoard(name, target);
    board = boardInDom;
    ctx = boardInDom.getContext('2d');
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
    board.width = width; };

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
    setBoard: setBoard,
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
