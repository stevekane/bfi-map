minispade.require('projectile.js');

var assert = chai.assert;


describe("Kane.Projectile", function () {
  var p
    , manager = {
        spawn: function () {},
    };

  beforeEach(function () {
    p = new Kane.Projectile({
      manager: manager
    });
  });

  it('should return an object', function () {
    assert.isObject(p);
  });

  describe("#afterUpdate()", function () {
    it('it should be a function', function () {
      assert.isFunction(p.afterUpdate);
    });
  });

  describe("#collide()", function () {
    it('should be a function', function () {
      assert.isFunction(p.collide);
    });

    it('should kill both target and projectile', function () {
      var targ = new Kane.Projectile();

      p.collide(targ);
      assert.isTrue(p.isDead); 
    });
  });
  
});
