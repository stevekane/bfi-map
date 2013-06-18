minispade.require('loadingscene.js');

/*
inherits some functionality from Kane.Scene
not all methods are tested if they are not overridden
see scene-tests for complete object tests
*/

var assert = chai.assert;

describe("Kane.LoadingScene", function () {
  var ls;

  beforeEach(function () {
    ls = new Kane.LoadingScene({
      name: 'loading',
      targetSceneName: 'myTarget',
    });
  });

  it('should return an object', function () {
    assert.isObject(ls); 
  });

  describe("#loadComplete()", function () {
    it('should be a function', function () {
      assert.isFunction(ls.loadComplete);
    });
  });

  describe("#stillLoading()", function () {
    it('should be a function', function () {
      assert.isFunction(ls.stillLoading);
    });
  });
});
