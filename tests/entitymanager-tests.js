minispade.require('entitymanager.js');

var assert = chai.assert;

describe('Kane.EntityManager', function () {
  var em;
  
  beforeEach(function () {
    em = new Kane.EntityManager();
  });

  it('should be an object', function () {
    assert.isObject(em);
  }); 

  describe('#generateUniqueId()', function () {
    it('should return a unique id', function () {
      assert.notEqual(
        em.generateUniqueId(),
        em.generateUniqueId()
      );
    });
  });

  describe('#spawn()', function () {
    it('should be a function', function () {
      assert.isFunction(em.spawn);
    });

    it('should create a new entity with provided constructor/settings object', function () {
      var ent = em.spawn(Kane.Entity, {});

      assert.isObject(ent);
      assert.instanceOf(ent, Kane.Entity);
    });

    it('should assign itself as a value called manager to the newly created entity', function () {
      var ent = em.spawn(Kane.Entity, {});
      //TODO: probably should access this via getter
      assert.equal(ent.manager, em);
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
      var deadEnt1 = em.spawn(Kane.Entity, {})
        , deadEnt2 = em.spawn(Kane.Entity, {})
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

  describe('#sortBy()', function () {
    it('should be a function', function () {
      assert.isFunction(em.sortBy);
    });

    it('should throw if propName, ascending not provided', function () {
      assert.throws(function () {
        em.sortBy();
      });
      assert.doesNotThrow(function () {
        em.sortBy('zIndex', true);
      });
    });

    it('should sort the entities by the specified property', function () {
      em.spawn(Kane.Entity, {zIndex: 1});
      em.spawn(Kane.Entity, {zIndex: 2});
      em.spawn(Kane.Entity, {zIndex: 0});

      em.sortBy('zIndex', true);
      
      //kind of a cheesy way to check this...
      em.listEntities().forEach(function (ent, index, em) {
        assert.equal(
          ent.zIndex,
          index
        ); 
      });

      em.sortBy('zIndex', false);

      //super brittle way to check the sort was successful...
      em.listEntities().forEach(function (ent, index, em) {
        assert.equal(
          ent.zIndex,
          em.length - index - 1
        ); 
      });
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

  /*
  we have no asserts here, if the expected collide method is called
  then mocha's done function will be called and this is successful
  else, we will timeout and fail (indicating collide was not called)
  */
  describe("#processCollisions()", function () {
      var collide = function () {
        this.done();
      } , noOverlap = { 
        x: 0, y: 20, h: 20, w: 20, 
      } , overlap1 = {
        x: 5, y: 5, h: 5, w: 5, collide: collide
      } , overlap2 = {
        x: 5, y: 5, h: 2, w: 2, collide: collide
      };

    it('should fire collide method if entities collide', function (done) {
      //this is weird, but we are injecting a ref to mocha's done onto
      //the objects so that their collide methods will call it
      overlap1.done = done; 
      overlap2.done = done; 

      //add three entities, 2 of whom should overlap
      em.spawn(Kane.Entity, noOverlap);
      em.spawn(Kane.Entity, overlap1);
      em.spawn(Kane.Entity, overlap2);
      em.processCollisions(em); 
    });
    
    it('should NOT fire collide if objects checked do not collide', 
    function () {
      //another weird thing.  Here we throw an error to indicate
      //an incorrect collide call and provide a failure
      overlap1.collide = null;
      noOverlap.collide = function () {
        throw new Error('collide erroneously called');
      };

      em.spawn(Kane.Entity, noOverlap);
      em.spawn(Kane.Entity, overlap1);
      em.processCollisions(em);
    });

    it('should not fire collide for an object if it collides with itself',
    function () {
      //here we add a method that will throw if an object improperly
      //detects a collision with itself
      overlap1.collide = function () {
        throw new Error('Object incorrectly collided with itself');
      };

      em.spawn(Kane.Entity, overlap1);
      em.processCollisions(em);
    });

    it('should not fire a collision if the subject does not collide', 
    function () {
      //here we add a method that will throw if an object that is flagged
      //doesCollide = false triggers a collide call
      var badCollide = function () {
        throw new Error('Object with doesCollide=false has collided');
      };
    
      overlap1.collide = badCollide;
      overlap1.doesCollide = false;
      overlap2.collide = badCollide;

      em.spawn(Kane.Entity, overlap1);
      em.spawn(Kane.Entity, overlap2);
      em.processCollisions(em);
    });
  });

  describe('#listEntities()', function () {
    it('should be a function', function () {
      assert.isFunction(em.listEntities);
    });

    it('should return an array of entities', function () {
      var newEnt = em.spawn(Kane.Entity, {})
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
      var enemies;

      em.spawn(Kane.Entity, {type: 'friend'});
      em.spawn(Kane.Entity, {type: 'enemy'});
      em.spawn(Kane.Entity, {type: 'enemy'});

      enemies = em.findByType('enemy');
      
      enemies.forEach(function (enemy) {
        assert.equal(enemy.type, 'enemy');
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
      var bobbys;

      em.spawn(Kane.Entity, {name: 'bobby'});
      em.spawn(Kane.Entity, {name: 'teddy'});

      bobbys = em.findByName('bobby');
      
      bobbys.forEach(function (enemy) {
        assert.equal(enemy.name, 'bobby');
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
