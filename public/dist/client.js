minispade.register('drawplane.js', function() {
"use strict";
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

});

minispade.register('game.js', function() {
"use strict";
Kane.Game = function () {};

Kane.Game.prototype = (function () {

  var isRunning = false
    , timeStamps = []
    , timeStampsMaxLength = 20
    , fps;

  //private
  /*
  loop is intended to be an imperative shell wrapping 
  mostly functional behavior (where possible)
  */
  var _loop = function () {
    if (!isRunning) { return; }

    timeStamps = _addTimeStamp(Date.now(), timeStamps, timeStampsMaxLength);
    window.requestAnimationFrame(_loop);
  };

  var _addTimeStamp = function (timestamp, timeStamps, maxlength) {

    timeStamps.unshift(timestamp);
    return timeStamps.filter(function(stamp, index) {
      return (index >= maxlength) ? false : true;
    });
  };


  //public
  var start = function () {
    isRunning = true;
    window.requestAnimationFrame(_loop);
  };

  var stop = function () {
    isRunning = false;
  };

  var getIsRunning = function () {
    return isRunning;
  };
  
  var getFPS = function () {
    //sanity checks
    if (!isRunning) { return 0; }

    var timeStampCount = timeStamps.length
      , totalTimeDelta
      , fps;
    
    //only 1 timestamp, cannot evaluate fps
    if (timeStampCount === 1) {
      fps = 0;
    } else {
      totalTimeDelta = timeStamps[0] - timeStamps[timeStampCount-1];
      fps = timeStampCount / totalTimeDelta * 1000;
    }

    return fps;
  };

  //public api
  return {
    start: start,
    stop: stop,
    getIsRunning: getIsRunning,
    getFPS: getFPS
  };

})();

});

minispade.register('main.js', function() {
"use strict";
window.Kane = {};
minispade.require('game.js');
minispade.require('drawplane.js');

var game = new Kane.Game();
var drawplane = new Kane.DrawPlane();

});
