minispade.require('main.js');

var assert = chai.assert;

describe("Kane.Loader", function () {
  var loader
    , cache = {
      cache: function () {},
    };

  beforeEach(function () {
    loader = new Kane.Loader({
      cache: cache
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

  describe("#loadImage()", function () {
    it('should throw if no image name provided', function () {
      assert.throws(function  () {
        loader.loadImage(); 
      });
    });
    
    it('should add an image to the loading images', function () {
      var loading = {}
        , image;

      loader.loadImage('funny.png');
      loading = loader.loading;
      image = loading['funny'];

      assert.isDefined(image);
      assert.instanceOf(image, Image);
    });
  });

  describe("#pushToCache()", function () {
    it('should be a function', function () {
      assert.isFunction(loader.pushToCache);
    });

    it('should throw if not provided an imageName', function () {
      assert.throws(function () {
        loader.pushToCache();
      }); 
    });

    it('should remove the image from loading object', function () {
      loader.loadImage('cat.png');
      loader.pushToCache('cat.png');
      assert.isUndefined(loader.loading['cat.png']);
    });
  });
  describe("#handleError()", function () {
    it('should be a function', function () {
      assert.isFunction(loader.handleError);
    });

    it('should throw if not provided an imageName', function () {
      assert.throws(function () {
        loader.pushToCache();
      }); 
    });

    it('should remove the image from loading object', function () {
      loader.loadImage('cat.png');
      loader.pushToCache('cat.png');
      assert.isUndefined(loader.loading['cat.png']);
    });
  });
});
