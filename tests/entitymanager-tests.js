minispade.require('main.js');

var assert = chai.assert;

describe('Kane.EntityManager', function () {
  var em
    , drawplane = {};
  
  beforeEach(function () {

    em = new Kane.EntityManager(drawplane);
  });

  it('should be an object', function () {
    assert.isObject(em);
  }); 

  it('should throw if no drawplane is provided to constructor', function () {
    assert.throws(function () {
      em = new Kane.EntityManager();
    });

    assert.doesNotThrow(function () {
      em = new Kane.EntityManager(drawplane);
    });
  });

  describe('#spawn()', function () {
    it('should be a function', function () {
      assert.isFunction(em.spawn);
    });

    it('should create a new entity with provided constructor/settings object', function () {
      var ent = em.spawn(Kane.Entity, {drawplane: drawplane});

      assert.isObject(ent);
      assert.equal(drawplane, ent.drawplane);
      assert.instanceOf(ent, Kane.Entity);
    });
    
    it('should throw if not provided a constructor', function () {
      assert.throws(function () {
        em.spawn();
      });
    });
  });
  
  describe('#removeDead()', function () {
    it('be a function', function () {
      assert.isFunction(em.removeDead);
    });

    it('should return a list of all dead entities', function () {
      var deadEnt1 = em.spawn(Kane.Entity, {drawplane: drawplane})
        , deadEnt2 = em.spawn(Kane.Entity, {drawplane: drawplane})
        , deadEnts
        , remainingEnts;

      deadEnt1.kill();
      deadEnt2.kill();

      deadEnts = em.removeDead();
      remainingEnts = em.listEntities();

      assert.lengthOf(deadEnts, 2);
      assert.lengthOf(remainingEnts, 0);
    });
  });

  describe('#updateAll()', function () {
    it('should be a function', function () {
      var dT = 100;

      assert.isFunction(em.updateAll);
      assert.doesNotThrow(function () {
        em.updateAll(dT);
      });
    });
  });

  describe('#drawAll()', function () {
    it('should be a function', function () {
      assert.isFunction(em.drawAll);

      assert.doesNotThrow(function () {
        em.drawAll();
      });
    });
  });

  describe('#listEntities()', function () {
    it('should be a function', function () {
      assert.isFunction(em.listEntities);
    });

    it('should return an array of entities', function () {
      var newEnt = em.spawn(Kane.Entity, {drawplane: drawplane})
        , ents = em.listEntities();
  
      assert.isObject(ents);
      assert.equal(newEnt, ents[0]);
    });
  });

  describe('#findByType()', function () {
    it('should be a function', function () {
      assert.isFunction(em.findByType);
    });

    it('should throw if no type is provided', function () {
      assert.throws(function () {
        em.findByType();
      });
    });
  
    it('should return all entities of a specified type', function () {
      var enemies
        , type = 'enemy';

      em.spawn(Kane.Entity, {drawplane: drawplane, type: 'friend'});
      em.spawn(Kane.Entity, {drawplane: drawplane, type: type});
      em.spawn(Kane.Entity, {drawplane: drawplane, type: type});
      em.spawn(Kane.Entity, {drawplane: drawplane, type: type});
      em.spawn(Kane.Entity, {drawplane: drawplane, type: type});

      enemies = em.findByType(type);
      
      enemies.forEach(function (enemy) {
        assert.equal(enemy.type, type);
      });
    });
  });

  describe('#findByName()', function () {
    it('should be a function', function () {
      assert.isFunction(em.findByName);
    });

    it('should throw if no name is provided', function () {
      assert.throws(function () {
        em.findByName();
      });
    });
  
    it('should return all entities of a specified name', function () {
      var bobby 
        , name = 'bobby';

      em.spawn(Kane.Entity, {drawplane: drawplane, name: 'notbobby'});
      em.spawn(Kane.Entity, {drawplane: drawplane, name: name});

      bobby = em.findByName(name);
      
      bobby.forEach(function (enemy) {
        assert.equal(enemy.name, name);
      });
    });
  });

  describe('#callForAll()', function () {
    it('should be a function', function () {
      assert.isFunction(em.callForAll);
    });
    
    it('should throw if not provided a methodName', function () {
      assert.throws(function () {
        em.callForAll();
      });
      
      assert.doesNotThrow(function () {
        em.callForAll('update');
      });
    });
  });

  describe('#applyForAll()', function () {
    it('should be a function', function () {
      assert.isFunction(em.applyForAll);
    });
    
    it('should throw if not provided a methodName', function () {
      assert.throws(function () {
        em.applyForAll();
      });
      
      assert.doesNotThrow(function () {
        em.applyForAll('update');
      });
    });
  });
});
