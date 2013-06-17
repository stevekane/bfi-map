minispade.require('entity.js');

var assert = chai.assert;

describe('Kane.Entity', function () {
  var en;
  
  beforeEach(function () {
    en = new Kane.Entity();
  });

  it('should return an object', function () {
    assert.isObject(en);
  });

  //Id
  it('should define name, type, and id', function () {
    assert.isString(en.name);
    assert.isString(en.type);
    assert.isNumber(en.id);
  });

  describe('#kill()', function () {
    it('should be a function', function () {
      assert.isFunction(en.kill);
    })

    it('should mark an entity for death', function () {
      en.kill();
      assert.isTrue(en.isDead);
    });
  });

  describe('#beforeUpate()', function () {
    it('is fired before core of updating (calculating physics)', function () {});
    it('should be a function', function () {
      assert.isFunction(en.beforeUpdate); 
    });
  });
  
  describe("#update()", function () {
    //in ms 
    var dT = 100 
      , dx = 2
      , ddx = 2
      , dy = 2
      , ddy = 2;

    it('is a function', function () {
      assert.isFunction(en.update);
    });

    it('should throw if not provided a deltaT', function () {
      assert.throws(function () {
        en.update();
      });
      assert.doesNotThrow(function () {
        en.update(dT);
      });
    });
  
    it('should change x and dx based on dT, dx, ddx', function () {
      var oldPos = en.x
        , newPos
        , oldVel = dx
        , newVel;

      en.dx = dx;
      en.ddx = ddx;
      en.update(dT); 

      newPos = oldPos + dT * dx;
      newVel = oldVel + dT * ddx;
      
      assert.equal(newPos, en.x); 
      assert.equal(newVel, en.dx); 
    });

    it('should change y and dy based on dT, dy, ddy', function () {
      var oldPos = en.y
        , newPos
        , oldVel = dy
        , newVel;

      en.dy = dy;
      en.ddy = ddy;
      en.update(dT); 

      newPos = oldPos + dT * dy;
      newVel = oldVel + dT * ddy;
      
      assert.equal(newPos, en.y); 
      assert.equal(newVel, en.dy); 
    });

  });

  describe('#afterUpdate()', function () {
    it('is fired after of updating (calculating physics)', function () {});
    it('should be a function', function () {
      assert.isFunction(en.afterUpdate); 
    });
  });

  describe("#collide()", function () {
    it('should be a function', function () {
      assert.isFunction(en.collide);
    });
    it('should throw if no target is provided', function () {
      assert.throws(function () {
        en.collide();
      });
    });
  });
});
