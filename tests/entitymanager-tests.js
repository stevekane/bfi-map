minispade.require('main.js');

var assert = chai.assert;

describe('Kane.EntityManager', function () {

  var drawplane = Test.createDrawPlane('testplane')
    , entities = Test.createEntities(drawplane, 50)
    , iq = Test.createInputQueue()
    , player = Test.createPlayer(drawplane, iq)
    , em;

  beforeEach(function () {
    em = new Kane.EntityManager(entities, drawplane, player);
  });

  it('should define a store of entities with the passed entities', function () {
    assert.isDefined(em.store);
    assert.isArray(em.store);
    em.store.forEach(function (ent) {
      assert.isFalse(ent.isActive); 
    }); 
  });

  it('should define an array called active', function () {
    assert.isDefined(em.active);
    assert.isArray(em.active);
  });

  it('should throw if entities, drawplane, player not provided to constructor', function () {
    assert.throws(function () {
      em = new Kane.EntityManager();
    });
    assert.throws(function () {
      em = new Kane.EntityManager(entities);
    });
    assert.throws(function () {
      em = new Kane.EntityManager(entities, drawplane);
    });
    assert.doesNotThrow(function () {
      em = new Kane.EntityManager(entities, drawplane, player);
    }); 
  });
  
  describe('#activateFromStore()', function () {

    beforeEach(function () {
      em = Test.createEntityManager(entities, drawplane, player);
    });

    it('should be a function', function () {
      assert.isFunction(em.activateFromStore);
    });

    it('should throw if the store is empty', function () {
      em.store = [];
      assert.throws(function () {
        em.activateFromStore();
      });
    });

    it('should throw if no settings hash provided', function () {
      assert.throws(function () {
        em.activateFromStore();
      });
    });

    it('should move first element of store onto active array', function () {
      var targetEnt = em.store[0]
        , newActiveEnt;

      em.activateFromStore({});
      newActiveEnt = em.active[0];

      assert.equal(
        targetEnt,
        newActiveEnt,
        "first element from store moved to active"
      ); 
    });
      
    it('should set isActive to true', function () {
      var newActiveEnt;
  
      em.activateFromStore({});
      newActiveEnt = em.active[0];     
      
      assert.isTrue(newActiveEnt.isActive);
    });

    it('should set valid settings on entity from provided settings hash', function () {
      var newActiveEnt
        , x = 10
        , y = 10
        , type = 'testEnt';
  
      em.activateFromStore({
        x: x,
        y: y,
        type: type 
      });
      newActiveEnt = em.active[0];     
      
      assert.equal(newActiveEnt.x, x);
      assert.equal(newActiveEnt.y, y);
      assert.equal(newActiveEnt.type, type);
    });
  });
  
  describe('#deactivate()', function () {
    it('should be a function', function () {
      assert.isFunction(em.deactivate);
    }); 

    it('should throw if no entity provided', function () {
      assert.throws(function () {
        em.deactivate();
      });
    });
  
    it('should throw if entity does not exist in active array', function () {
      var badEnt = Test.createEntity(drawplane)
        , goodEnt;

      em.activateFromStore({});
      goodEnt = em.active[0];

      assert.throws(function () {
        em.deactivate(badEnt);
      });

      assert.doesNotThrow(function () {
        em.deactivate(goodEnt);
      });
    });

    it('should move the targetted entity back to the store', function () {
      var activeEnt 
        , entReturnedToStore;

      em.activateFromStore({});
      activeEnt = em.active[0];

      em.deactivate(activeEnt);
      entReturnedToStore = em.store[0];

      assert.equal(
        activeEnt,
        entReturnedToStore,
        "activeEnt returned to store"
      );
    });
  });

  describe('#updateActive()', function () {
    it('should be a function', function () {
      assert.isFunction(em.updateActive);
    });  
    
    it('should throw if not provided a dT argument', function () {
      var dT = 1000;

      assert.throws(function () {
        em.updateActive();
      });

      assert.doesNotThrow(function () {
        em.updateActive(dT);
      });
    });
  });

  describe('#drawActive()', function () {
    it('should be a function', function () {
      assert.isFunction(em.drawActive);
    });  
  });

  describe('#updatePlayer()', function () {
    it('should be a function', function () {
      assert.isFunction(em.updatePlayer);
    });  
    
    it('should throw if not provided a dT argument', function () {
      var dT = 1000;

      assert.throws(function () {
        em.updatePlayer();
      });

      assert.doesNotThrow(function () {
        em.updatePlayer(dT);
      });
    });
  });

  describe('#drawPlayer()', function () {
    it('should be a function', function () {
      assert.isFunction(em.drawPlayer);
    });  
  });
});
