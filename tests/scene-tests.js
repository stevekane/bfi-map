minispade.require('scene.js');

var assert = chai.assert;

describe('Kane.Scene', function () {
  var s;

  beforeEach(function () {
    s = new Kane.Scene({name: 'testScene'});
  });

  it('should return an object', function () {
    assert.isObject(s);
  });

  it('should throw if no name provided in settings hash', function () {
    assert.throw(function (){
      s = new Kane.Scene({});
    });
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
});
