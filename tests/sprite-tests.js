minispade.require('sprite.js');

var assert = chai.assert;

describe("Kane.Sprite", function () {
  var s
    , image = new Image();

  beforeEach(function () {
    s = new Kane.Sprite({
      image: image
    });
  }); 

  it('should return an object', function () {
    assert.isObject(s); 
  });

  it('should throw if no valid image is provided to the constructor', function () {
    assert.throws(function () {
      s = new Kane.Sprite();
    });
  });

  it('should assign a default value of 0 to x, y, w, h if none provided', function () {
    s = new Kane.Sprite({
      image: image
    });

    assert.equal(s.x, 0);
    assert.equal(s.y, 0);
    assert.equal(s.w, 0);
    assert.equal(s.h, 0);
  });

  it('should assign values to x, y, w, h if provided', function () {
    var x = 1, y = 2, w = 3, h = 4;
  
    s = new Kane.Sprite({
      image: image,
      x: x,
      y: y,
      w: w, 
      h: h
    });

    assert.equal(s.x, x);
    assert.equal(s.y, y);
    assert.equal(s.w, w);
    assert.equal(s.h, h);
  });
});
