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
      var image = new Image();

      cache.cache({
        name: 'testImage', 
        asset: image
      });      
     
      assert.equal(cache.getByName('testImage'), image);
    });
  });

  describe("#getByName", function () {
    it('should return an object found by the provided name', function () {
      var testImage = new Image();

      cache.cache({
        name: 'testImage', 
        asset: testImage
      });

      assert.isDefined(cache.getByName('testImage'));
      assert.equal(cache.getByName('testImage'), testImage);
    });
  });
});
