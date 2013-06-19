minispade.require('assetloader.js');

var assert = chai.assert;
  var al
    , cache = {
       cache: function (name, asset) {} 
      };
  
  beforeEach(function () {
    al = new Kane.AssetLoader({
      cache: cache 
    });
  });

describe("Kane.AssetLoader", function () {
  it('should return a new object', function () {
    assert.isObject(al);
  });

  it('should throw if no cache is provided', function () {
    assert.throws(function () {
      al = new Kane.AssetLoader();
    });
  });

  describe("#loadAssets()", function () {
    it('should throw if not provided a groupName, assets, and callback', 
    function () {

      /*
      our callback should get called to demonstrate our 
      loadMethod is working since neither item will actually 
      successfully be loaded, we expect to get back 2 errors
      */
      var callback = function (errors) {}
        , groupName = 'testGroup'
        , assetNames = ['cat/power.png', 'dong/ding.json'];

      assert.throws(function () {
        al.loadAssets(groupName);
      });

      assert.throws(function () {
        al.loadAssets(groupName, assetNames);
      });

      assert.doesNotThrow(function () {
        al.loadAssets(groupName, assetNames, callback);
      }); 
    });

    it('should return a specified callback', function (done) {
      var callback = function (errors) {
        assert.lengthOf(errors, 3);
        done(); 
      }
        , groupName = 'testGroup'
        , assetNames = ['dog/cannot/win.jpg', 
                        'cat/power.png', 
                        'dong/ding.json'];

      al.loadAssets(groupName, assetNames, callback);
    });
  });
});
