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
      bus: new Bacon.Bus(),
      targetSceneName: 'myTarget',
    });
  });

  it('should return an object', function () {
    assert.isObject(ls); 
  });

  describe("#onUpdate()", function () {
    it('should put a transition event on the scene bus', function (done) {
      var busEvent;

      //assign an event callback to the bus.  we expect a 
      //bus event to fire from this onUpdate call
      ls.bus.onValue(function (event) {
        assert.equal(event.type, 'transition'); 
        assert.equal(event.content.name, ls.targetSceneName); 
        done();
      });      

      ls.onUpdate();
    });
  });

  describe("#loadComplete()", function () {
    it('should be a function', function () {
      assert.isFunction(ls.loadComplete);
    });

    it('should put a transition event on the scene bus', function (done) {
      
      //assign an event callback to the bus.  we expect a 
      //bus event to fire from this loadComplete call
      ls.bus.onValue(function (event) {
        assert.equal(event.type, 'transition'); 
        assert.equal(event.content.name, ls.targetSceneName); 
        done();
      });      
      ls.loadComplete();
    });
  });

  describe("#stillLoading()", function () {
    it('should be a function', function () {
      assert.isFunction(ls.stillLoading);
    });
  });
});
