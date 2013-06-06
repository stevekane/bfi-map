minispade.require('main.js');

var assert = chai.assert;

describe('Kane.Player', function () {
  var p
    , drawPlane = Test.createDrawPlane('tests')
    , iq = Test.createInputQueue();
  
  beforeEach(function () {
    p = new Kane.Player(drawPlane, iq);
  });

  it('should create an object that inherits from entity', function () {
    assert.isObject(p);
  });

  it('should set inputQueue to inputQueue passed to constructor', function () {
    assert.isDefined(p.inputQueue);
    assert.isNotNull(p.inputQueue);
    assert.isObject(p.inputQueue);
  });

  it('should throw if no inputQueue is provided', function () {
    assert.throws(function () {
      p = new Kane.Player(drawPlane);
    });
  });
  
  it('should define a movespeed', function () {
    assert.isNumber(p.moveSpeed);
  });

  it('should define a keymap', function () {
    assert.isObject(p.keyMap);
  });

  /*
  methods not tested here are tested on Kane.Entity
  since player is a subclass and the method wasn't overridden
  */
  
  describe('#processInputs()', function () {
    it('should be a function', function () {
      assert.isFunction(p.processInputs);
    });

    it('should flush the events from the inputQueue', function () {

      //simulate up arrow pressed 
      p.inputQueue.enqueueEvent(Test.createInputEvent('keydown', {keyCode: 38}));
      p.processInputs();
      assert.equal(
        p.inputQueue.fetchAllEvents().length,
        0
      );
    });
  });

  /*
  EACH MOVEMENT IS NOT YET TESTED AS THEY 
  ARE IMPLEMENTED FOR EXPERIMENTATION THUS FAR
  */

});
