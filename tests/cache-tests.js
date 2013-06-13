minispade.require('main.js');

var assert = chai.assert;

describe("Kane.Cache", function () {
  var cache;

  beforeEach(function () {
    cache = new Kane.Cache();
  });

  it('should return an object', function () {
    assert.isObject(cache);
  });

  describe("#cache()", function () {
    it('should be a function', function () {
      assert.isFunction(cache.cache);
    });
    it('should push the provided object into the cache', function () {
      cache.cache('testImage', new Image());      
      
    });
  });

  describe("#getByName", function () {
    it('should return an object found by the provided name', function () {
      var testImage = new Image();

      cache.cache('testImage', testImage);
      assert.isDefined(cache.getByName('testImage'));
      assert.equal(cache.getByName('testImage'), testImage);
    });

    it('should throw if no object by that name is found', function () {
      assert.throws(function () {
        cache.getByName('notThere');
      });
    });
  });
});
