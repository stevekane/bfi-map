Kane.Game = function () {};

Kane.Game.prototype = (function () {

  var isRunning = false
    , timeStamps = []
    , timeStampsMaxLength = 20
    , fps;

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

  //public api
  return {
    start: start,
    stop: stop,
    getIsRunning: getIsRunning,
    getFPS: getFPS
  };

})();
