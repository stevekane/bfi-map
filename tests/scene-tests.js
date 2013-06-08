minispade.require('main.js');

var assert = chai.assert;

describe('Kane.Scene', function () {
  //TODO: move this into a stub class version of these objects
  var s;

  beforeEach(function () {
    s = new Kane.Scene('testScene', {});
  });

  it('should return an object', function () {
    assert.isObject(s);
  });

  describe('#update()', function () {
    it('should be a function', function () {
      assert.isFunction(s.update);
    });

    it('should throw if not provided dT', function () {
      var dT = 1000;

      assert.throws(function () {
        s.update();
      });

      assert.doesNotThrow(function () {
        s.update(dT);
      });
    });
  }); 

  describe('#draw()', function () {
    it('should be a function', function () {
      assert.isFunction(s.draw); 
    });
  });

  describe('#onEnter()', function () {
    it('should be a function', function () {
      assert.isFunction(s.onEnter);
    });
  });

  describe('#onExit()', function () {
    it('should be a function', function () {
      assert.isFunction(s.onExit);
    });
  });

  describe('#onDraw()', function () {
    it('should be a function', function () {
      assert.isFunction(s.onDraw);
    });
  });

  describe('#onUpdate()', function () {
    it('should be a function', function () {
      assert.isFunction(s.onUpdate);
    });
  });

  describe('#processInput()', function () {
    it('should be a function', function () {
      assert.isFunction(s.processInput);
    });
  });
});
