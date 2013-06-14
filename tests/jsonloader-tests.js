minispade.require('main.js');

var assert = chai.assert;


describe("Kane.JSONLoader", function () {
  var jl
    , loader
    , cache = {
        cache: function () {},
    }
    , bus = {
        push: function () {},
    };

  beforeEach(function () {
    jl = new Kane.JSONLoader({
      cache: cache,
      bus: bus 
    });
  });

  it('should return an object', function () {
    assert.isObject(jl);
  });

  //we test loadAsset as it is overridden
  
  describe("#loadAsset()", function () {
    it('should throw if no asset name provided', function () {
      assert.throws(function  () {
        jl.loadAsset(); 
      });
    });
    
    it('should add an image to the loading images', function () {
      var loading = {}
        , json;

      jl.loadAsset('funny.json');
      json = jl.loading['funny'];

      assert.isObject(json);
    });
  });
});
