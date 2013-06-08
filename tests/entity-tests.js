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

  describe('#setType()', function () {
    it('should be a function that throws if no type is provided', function () {
      assert.isFunction(en.setType);
      assert.throws(function () {
        en.setType();
      });
      assert.doesNotThrow(function () {
        en.setType('enemy');
      });
    });

    it('should set the type to the provided type', function () {
      en.setType('foe');
      assert.equal(en.getType(), 'foe');
    });
  });

  describe('#getType()', function () {
    it('should be a function that returns a type string', function () {
      assert.isFunction(en.getType);
    
      en.setType('friend');
      assert.isString(en.getType());
      assert.equal(en.getType(), 'friend');
    });
  });

  describe('#setName()', function () {
    it('should be a function that throws if no name is provided', function () {
      assert.isFunction(en.setName);
      assert.throws(function () {
        en.setName();
      });
      assert.doesNotThrow(function () {
        en.setName('steve');
      });
    });

    it('should set the name to the provided name', function () {
      en.setName('steve');
      assert.equal(en.getName(), 'steve');
    });
  });

  describe('#getName()', function () {
    it('should be a function that returns a name string', function () {
      assert.isFunction(en.getName);
    
      en.setName('teddy');
      assert.isString(en.getName());
      assert.equal(en.getName(), 'teddy');
    });
  });

  describe('#setId()', function () {
    it('should be a function that throws if no id is provided', function () {
      assert.isFunction(en.setId);
      assert.throws(function () {
        en.setId();
      });
      assert.doesNotThrow(function () {
        en.setId(5);
      });
    });

    it('should set the id to the provided id', function () {
      en.setId(5);
      assert.equal(en.getId(), 5);
    });
  });

  describe('#getId()', function () {
    it('should be a function that returns a id', function () {
      assert.isFunction(en.getId);
    
      en.setId(5);
      assert.equal(en.getId(), 5);
    });
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
