/*
renderer is responsible for drawing the main gamespace
*/
Kane.Renderer = function (canvas) {
  this.board = canvas;
};

Kane.Renderer.prototype = (function () {

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

  return {
    getCtx: getCtx,
    getBoard: getBoard,
    setHeight: setHeight,
    getHeight: getHeight,
    setWidth: setWidth,
    getWidth: getWidth
  };

})();
