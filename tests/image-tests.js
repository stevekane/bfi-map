minispade.require('main.js');

var assert = chai.assert;

describe('Kane.Image', function () {
  var image;

  beforeEach(function () {
    image = new Kane.Image({
      fileName: 'cat.png'
    });
  });

  it('should return an object with'+
    'data/origin/isLoaded/didError/height/width attributes', function () {
    assert.isObject(image);
    assert.isObject(image.data);
    assert.instanceOf(image.data, Image);

    assert.isDefined(image.origin);
    assert.isString(image.origin);

    assert.isFalse(image.isLoaded);
    assert.isFalse(image.didError);
  
    assert.isDefined(image.height);
    assert.isDefined(image.width);
  });

  it('should throw if no fileName is provided in settings hash', function () {
    assert.throw(function () {
      image = new Kane.Image();
    });
  });

  it('should call load if settings hash includes autoLoad: true', function () {
    image = new Kane.Image({
      autoLoad: true,
      fileName: 'autoloading.png'
    });
    assert.equal(
      image.data.src, 
      window.location.origin + '/autoloading.png'
    );
  });

  describe('#load()', function () {
    it('should set the src of the data object', function () {
      image.load();

      assert.isDefined(image.data.src); 
      assert.equal(
        image.data.src,
        window.location.origin + '/cat.png'
      );
    });
  });
  
});
