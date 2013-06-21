minispade.require('frame.js');

var assert = chai.assert;

describe("", function () {
  var f;

  beforeEach(function () {
    f = new Kane.Frame({
      x: 0,
      y: 0,
      w: 20,
      h: 20
    });    
  });
  
  it('return an object', function () {
    assert.isObject(f);
  });

  it('should throw if not provided x,y,w,h', function () {
    assert.throws(function () {
      f = new Kane.Frame({
        x: 0,
        y: 0,
        w: 0,
      }); 
    });
    assert.throws(function () {
      f = new Kane.Frame({
        x: 0,
        y: 0,
        h: 0,
      }); 
    });
    assert.throws(function () {
      f = new Kane.Frame({
        x: 0,
        h: 0,
        w: 0,
      }); 
    });
    assert.throws(function () {
      f = new Kane.Frame({
        y: 0,
        h: 0,
        w: 0,
      }); 
    });
  });
});
