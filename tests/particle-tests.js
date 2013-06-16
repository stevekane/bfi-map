minispade.require('particle.js');

var assert = chai.assert;

describe("Kane.Particle", function () {
  var p;

  beforeEach(function () {
    p = new Kane.Particle();
  });

  it('should return an object', function () {
    assert.isObject(p);
  });

  describe("#afterUpdate()", function () {
    it('it should be a function', function () {
      assert.isFunction(p.afterUpdate);
    });
  });
});
