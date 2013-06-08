minispade.require('main.js');

var assert = chai.assert;

describe('Kane.Entity', function () {
  var en
    , drawplane = Test.createDrawPlane('tests');
  
  beforeEach(function () {
    en = Test.createEntity({drawplane: drawplane});
  });

  it('should return an object', function () {
    assert.isObject(en);
  });

  it('should throw if not provided a drawplane object', function () {
    var badEntity;

    assert.throws(function () {
      badEntity = new Kane.Entity();
    });
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
      assert.isTrue(en.isDead());
    });
  });

  describe('#isDead()', function () {
    it('should be a function', function () {
      assert.isFunction(en.isDead);
    })
    
    it('should return a boolean value', function () {
      assert.isBoolean(en.isDead());
    });

    it('should return true if an object has been killed', function () {
      en.kill();
      assert.isTrue(en.isDead());
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

  describe('#draw()', function () {
    it('should be a function', function () {
      assert.isFunction(en.draw); 
    });
  });    
});
