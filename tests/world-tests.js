minispade.require('world.js');

var assert = chai.assert;

describe('Kane.World', function () {
  var w
    , data = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
    , bus = {};

  beforeEach(function () {
    w = new Kane.World({
      bus: bus,
    });
  });

  it('should return an object', function () {
    assert.isObject(w);
  });

  it('should throw if no bus is provided', function () {
    assert.throws(function () {
      w = new Kane.World();
    });
  });

  describe("#loadData()", function () {
    it('should load the current Data into the world object', function () {
      w.loadData(data); 

      assert.isTrue(w.isLoaded);
    });
     
    it('should throw if no data object is provided', function () {
      assert.throws(function () {
        w.loadData();
      });
    });
  });
});
