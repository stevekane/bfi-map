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

  describe("#flushByName()", function () {
    it('should remove the named object from the cache', function () {
      cache.cache({
        name: "toBeFlushed",
        asset: {}
      });

      cache.flushByName('toBeFlushed');
      assert.isUndefined(cache.getByName('toByFlushed'));
    });
  });

  describe("#flush()", function () {
    it('should remove everything from the cache', function () {
      var ob1 = {
        name: 'ob1',
        asset : {}
      };
      var ob2 = {
        name: 'ob2',
        asset : {}
      };
      
      cache.cache(ob1);
      cache.cache(ob2);

      cache.flush();

      assert.isFalse(cache.allInCache(['ob1', 'ob2']));
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

  describe('#allInCache()', function () {
    it('should return boolean value', function () {
      assert.isBoolean(cache.allInCache());
    });

    it('should return true if every item is in the cache else false', function () {
      var ob1 = {
        name: 'ob1',
        asset : {}
      };
      var ob2 = {
        name: 'ob2',
        asset : {}
      };
      cache.cache(ob1);
      cache.cache(ob2);

      assert.isTrue(cache.allInCache(['ob1', 'ob2']));
      assert.isFalse(cache.allInCache(['ob1', 'ob2', 'ob3'])); 
    });
  });
});
