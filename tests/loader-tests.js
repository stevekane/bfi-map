minispade.require('loader.js');

var assert = chai.assert;

describe("Kane.Loader", function () {
  var loader
    , cache = {
        cache: function () {},
    }
    , bus = {
        push: function () {},
    };

  beforeEach(function () {
    loader = new Kane.Loader({
      cache: cache,
      bus: bus
    });
  });

  it('should return an object', function () {
    assert.isObject(loader);
  });

  it('should throw if no cache is provided in settings', function () {
    assert.throws(function () {
      loader = new Kane.Loader();
    });
  });

  it('should throw if no bus is provided in settings', function () {
    assert.throws(function () {
      loader = new Kane.Loader({
        cache: cache
      });
    });
  });

  describe("#loadAsset()", function () {
    it('should throw if no asset name provided', function () {
      assert.throws(function  () {
        loader.loadAsset(); 
      });
    });
    
    it('should add an image to the loading images', function () {
      var loadingAsset;

      loader.loadAsset('funny.txt');
      loadingAsset = loader.loading['funny'];

      assert.isObject(loadingAsset);
    });
  });

  describe("#handleError()", function () {
    it('should be a function', function () {
      assert.isFunction(loader.handleError);
    });

    it('should throw if not provided an imageName', function () {
      assert.throws(function () {
        loader.handleError();
      }); 
    });
  });

  describe("#broadcast()", function () {
    it('should be a function', function () {
      assert.isFunction(loader.broadcast);
    });

    it('should throw if name/asset not provided', function () {
      assert.throws(function () {
        loader.broadcast({});
      });
    });
  
    it('should remove the named object from the loading object', function () {
      loader.loadAsset('captaincrunch.jpg');

      loader.broadcast({
        name: 'captaincrunch',
        asset: loader.loading['captaincrunch']
      });

      assert.isUndefined(loader.loading['captaincrunch']);
    });
  });
});
