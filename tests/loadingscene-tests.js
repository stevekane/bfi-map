minispade.require('loadingscene.js');

/*
inherits some functionality from Kane.Scene
not all methods are tested if they are not overridden
see scene-tests for complete object tests
*/

var assert = chai.assert;

describe("Kane.LoadingScene", function () {
  var ls
    , cache
    , loader;

  beforeEach(function () {
    cache = new Kane.Cache();
    loader = new Kane.AssetLoader({cache: cache})
    ls = new Kane.LoadingScene({
      name: 'loading',
      targetSceneName: 'myTarget',
      cache: cache,
      loader: loader
    });
  });

  it('should return an object', function () {
    assert.isObject(ls); 
  });

  it('should throw if no cache or loader provided', function () {
    assert.throws(function () {
      ls = new Kane.LoadingScene({
        name: 'loading',
        targetSceneName: 'myTarget'
      });
    });

    assert.throws(function () {
      ls = new Kane.LoadingScene({
        name: 'loading',
        targetSceneName: 'myTarget',
        cache: cache
      });
    });

    assert.doesNotThrow(function () {
      ls = new Kane.LoadingScene({
        name: 'loading',
        targetSceneName: 'myTarget',
        cache: cache,
        loader: loader
      });
    });
  });
});
