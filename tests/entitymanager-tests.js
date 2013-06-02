minispade.require('main.js');

var assert = chai.assert;

describe('Kane.EntityManager', function () {
  it('should return an object', function () {
    var em = new Kane.EntityManager(Kane.Player);
    assert.isObject(em);
  });
  
  it('should contain an array of entities', function () {
    var em = new Kane.EntityManager(Kane.Player);
    assert.isArray(em.entities);      
  });

  it('should require an entityclass', function () {
    assert.throws(function () {
      var em = new Kane.EntityManager();
    }); 
  }); 

});
