minispade.require('main.js');

var assert = chai.assert;

describe('Kane.Entity', function () {
  var en
    , drawplane = Test.createDrawPlane('tests');
  
  beforeEach(function () {
    en = Test.createEntity(drawplane);
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

  //position and dimension
  it('should define x, y, h, w, lastx, lasty', function () {
    assert.isNumber(en.x);
    assert.isNumber(en.y);
    assert.isNumber(en.h);
    assert.isNumber(en.w);
    assert.isNumber(en.lastx);
    assert.isNumber(en.lasty);
  });

  //velocity and accel
  it('should define dx, dy, ddx, ddy', function () {
    assert.isNumber(en.dx);
    assert.isNumber(en.dy);
    assert.isNumber(en.ddx);
    assert.isNumber(en.ddy);
  });

  //Id
  it('should define name, type, and id', function () {
    assert.isString(en.name);
    assert.isString(en.type);
    assert.isNumber(en.id);
  });

  //rendering
  it('should define zIndex', function () {
    assert.isNumber(en.zIndex);
  });

  //animations
  it('should define anims, and currentAnim', function () {
    assert.isDefined(en.anims);
    assert.isArray(en.anims);
    assert.isDefined(en.currentAnim);
  });

  describe("#activate()", function () {
    it('is a function', function () {
      assert.isFunction(en.activate);
    });
    
    it('should require a hash of parameters', function () {
      assert.throws(function () {
        en.activate();
      });
    });

    it('should throw if no drawplane is provided', function () {
      assert.throws(function () {
        en.activate();
      });
    });

    it('should throw if hash contains an invalid property', function () {
      assert.throws(function () {
        en.activate({notValid: 'someInvalidProp'});
      });
      assert.doesNotThrow(function () {
        en.activate({
          x: 10,
          y: 10,
          name: 'testEntity'
        });
      });
    });
    
    it('should assign each valid prop to the entitiy', function () {
      var x = 10
        , y = 10
        , name = "testEntity"
        , type = "player";

      en.activate({
        x: x,
        y: y,
        name: name,
        type: type
      });
    
      assert.equal(x, en.x);
      assert.equal(y, en.y);
      assert.equal(name, en.name);
      assert.equal(type, en.type);
    });
  });

  describe("#deactivate()", function () {
    it('should be a function', function () {
      assert.isFunction(en.deactivate);
    });

    it('should set isActive to false', function () {
      en.isActive = true;
      en.deactivate();
      assert.isFalse(en.isActive);
    });

    //not sure this test will hold up under refactor?  currently resets
    //to states of a newly created object
    it('should reset x, y, lastx, lasty, w, h, dx, dy, ddx, ddy, zIndex, name, type', function () {
      var baseEnt = Test.createEntity(drawplane);

      en.activate({
        x: 1,
        y: 1,
        lastx: 1,
        lasty: 1,
        w: 1,
        h: 1,
        dx: 1,
        dy: 1,
        ddx: 1,
        ddy: 1,
        zIndex: 1,
        name: 'testname',
        type: 'testent'
      });
      en.deactivate();
      
      assert.equal(en.x, baseEnt.x);      
      assert.equal(en.y, baseEnt.y);      
      assert.equal(en.lastx, baseEnt.lastx);      
      assert.equal(en.lasty, baseEnt.lasty);      
      assert.equal(en.w, baseEnt.w);      
      assert.equal(en.h, baseEnt.h);      
      assert.equal(en.dx, baseEnt.dx);      
      assert.equal(en.dy, baseEnt.dy);      
      assert.equal(en.ddx, baseEnt.ddx);      
      assert.equal(en.ddy, baseEnt.ddy);      
      assert.equal(en.zIndex, baseEnt.zIndex);      
      assert.equal(en.name, baseEnt.name);      
      assert.equal(en.type, baseEnt.type);      
    }); 
  });

  describe("#update()", function () {
    //in ms 
    var dT = 100 
      , dx = 2
      , ddx = 2
      , dy = 2;

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
  
    it('should change x based on dT, dx, and ddx', function () {
      var oldPos = en.x
        , newPos;

      en.dx = dx;
      en.ddx = ddx;
      en.update(dT); 

      newPos = (.5 * en.ddx * dT * dT) + (en.dx * dT) + oldPos;
      
      assert.equal(
        newPos,
        en.x,
        "new Pos matches expected new Pos"
      ); 
    });

    it('should change y based on dT, dy, and ddy', function () {
      var oldPos = en.y
        , newPos;

      en.dy = dy;
      en.update(dT); 

      newPos = (.5 * en.ddy * dT * dT) + (en.dy * dT) + oldPos;
      
      assert.equal(
        newPos,
        en.y,
        "new Pos matches expected new Pos"
      ); 
    });

    it('should return 0 for y if new y is less than 0', function () {
      en.y = 0;
      en.dy = 0;
      en.ddy = -10;

      en.update(dT);

      assert.equal(
        0,
        en.y,
        "position is bounded by 0"
      );
    });
  });

  describe('#draw()', function () {
    it('should be a function', function () {
      assert.isFunction(en.draw); 
    });
    
    it('should throw if the entity is not active', function () {
      assert.throws(function () {
        en.draw();
      });
      assert.doesNotThrow(function () {
        en.isActive = true;
        en.draw();
      });
    });
  });    
});
