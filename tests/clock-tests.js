minispade.require('clock.js');

var asser = chai.assert;

describe('Kane.Clock', function () {
  var clock;

  beforeEach(function () {
    clock = new Kane.Clock();
  });

  it('should return an object', function () {
    assert.isObject(clock);
  });

  describe('#start()', function () {
    it('should be a function', function () {
      assert.isFunction(clock.start);
    });

    it('should start recording', function () {
      clock.start();
      assert.isTrue(clock.isRecording);
    });

    it('should set the startTime and return it', function () {
      var startTime = clock.start();
      assert.isNumber(clock.startTime);
      assert.isNumber(startTime);
    });
  });

  describe('#stop()', function () {
    it('should be a function', function () {
      assert.isFunction(clock.stop);
    });

    it('should stop recording', function () {
      clock.stop();
      assert.isFalse(clock.isRecording);
    });
  
    it('should set the stopTime', function () {
      var stopTime = clock.stop();
      assert.isNumber(clock.stopTime);
      assert.isNumber(stopTime);
    });
  });

  describe('#getTimeDelta()', function () {
    it('should be a function', function () {
      assert.isFunction(clock.getTimeDelta);
    });

    it('should throw if the clock isnt recording', function () {
      assert.throws(function () {
        clock.getTimeDelta();
      });
    });

    it('should a number of ms since the last getTimeDelta was called', 
    function () {
      var dT;

      clock.start();
      dT = clock.getTimeDelta();

      assert.isNumber(dT);
    });
  });

  describe("#timeSinceStart()", function () {
    it('should return the amount of time in ms since start', function (done) {
      var startTime
        , timeSinceStart;

      clock.start();
      startTime = clock.startTime;      
      
      timeSinceStart = clock.timeSinceStart(); 
      assert.equal(0, timeSinceStart);

      setTimeout(function () {
        var timeAtleastFifty = (50 <= clock.timeSinceStart()) ? true : false;
        
        assert.isTrue(timeAtleastFifty);
        done();
      }, 50);
    });
  });
});
