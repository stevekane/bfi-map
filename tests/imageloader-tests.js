minispade.require('imageloader.js');

var assert = chai.assert;

describe("Kane.ImageLoader", function () {
  var loader
    , cache = {
        cache: function () {},
    }
    , bus = {
        push: function () {},
    };

  beforeEach(function () {
    loader = new Kane.ImageLoader({
      cache: cache,
      bus: bus
    });
  });

  it('should return an object', function () {
    assert.isObject(loader);
  });

  it('should throw if no cache is provided in settings', function () {
    assert.throws(function () {
      loader = new Kane.ImageLoader();
    });
  });

  it('should throw if no bus is provided in settings', function () {
    assert.throws(function () {
      loader = new Kane.ImageLoader({
        cache: cache
      });
    });
  });


  //we test this as it is overridden
  describe("#loadAsset()", function () {
    it('should throw if no asset name provided', function () {
      assert.throws(function  () {
        loader.loadAsset(); 
      });
    });
    
    it('should add an image to the loading images', function () {
      var image;

      loader.loadAsset('funny.png');
      image = loader.loading['funny'];

      assert.isDefined(image);
      assert.instanceOf(image, Image);
    });
  });
});
