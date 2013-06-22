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

  it('should assign a default value of 0 to sx, sy, w, h if none provided', function () {
    s = new Kane.Sprite({
      image: image
    });

    assert.equal(s.sx, 0);
    assert.equal(s.sy, 0);
    assert.equal(s.w, 0);
    assert.equal(s.h, 0);
  });

  it('should assign values to x, y, w, h if provided', function () {
    var sx = 1, sy = 2, w = 3, h = 4;
  
    s = new Kane.Sprite({
      image: image,
      sx: sx,
      sy: sy,
      w: w, 
      h: h
    });

    assert.equal(s.sx, sx);
    assert.equal(s.sy, sy);
    assert.equal(s.w, w);
    assert.equal(s.h, h);
  });
});
