var EntityManagerInterface = {
  spawn: function (constructor, args) {},
  removeDead: function () {},
  updateAll: function (dT) {},
  drawAll: function () {},
  listEntities: function () {},
  findByType: function (type) {},
  callForAll: function (methodName, args) {},
  applyForAll: function (methodName, argArray) {}
};

//requires array of entities
Kane.EntityManager = function (drawplane) {
  if (!drawplane) { throw new Error('must provide drawplane'); }
  
  //this will be iterated everytime an entity is created
  //to give it a unique id
  this.idCounter = 0;

  this.drawplane = drawplane;
};

Kane.EntityManager.prototype = new Array;

/*
different than "normal" syntax here is used to specifically state our intention
to add our interface methods onto the prototype we have defined which inherits core
functionality from Array
*/
_.extend(Kane.EntityManager.prototype, EntityManagerInterface);

//define our prototype methods here as per usual
Kane.EntityManager.prototype.spawn = function (constructor, args) {
  if (!constructor) { throw new Error('no constructor provided'); }

  var entity = new constructor(args);

  //entity has reference to its manager
  entity.manager = this;

  //each entity has a unique id
  entity.id = this.idCounter;

  //iterate the idCounter to preserve unique id for each created ent
  this.idCounter = this.idCounter + 1;

  //push the new entity onto the manager using array method
  this.push(entity); 

  //return the newly created entity
  return entity;
};

Kane.EntityManager.prototype.removeDead = function () {
  var deadEnts = []; 

  for (var i=0, len=this.length; i<len; i++) {
    if (this[i].isDead()) {
      //push this onto the array of deadEnts to return
      deadEnts.push(this[i]);
      //remove from "this"
      this.splice(i--, 1); 
      //shrink the length variable
      len--;
    }
  }
  return deadEnts;
};

Kane.EntityManager.prototype.updateAll = function (dT) {
  this.callForAll('update', dT);
};

Kane.EntityManager.prototype.drawAll = function () {
  this.callForAll('draw'); 
};

Kane.EntityManager.prototype.listEntities = function () {
  return this;
};

Kane.EntityManager.prototype.findByType = function (type) {
  if (!type) { throw new Error('no type provided'); }

  return this.filter(function (ent) {
    return (type === ent.type);
  });
};

Kane.EntityManager.prototype.findByName = function (name) {
  if (!name) { throw new Error('no name provided'); }

  return this.filter(function (ent) {
    return (name === ent.name);
  });
};

/*
additional arguments may be passed when calling this.
they will be passed to each object
*/
Kane.EntityManager.prototype.callForAll = function (methodName) {
  var args = Array.prototype.slice.call(arguments, 1);

  if (!methodName) { throw new Error('no methodName provided'); }

  this.forEach(function (entity) {
    if (entity[methodName]) {
      entity[methodName].apply(entity, args);
    }
  });
};

Kane.EntityManager.prototype.applyForAll = function (methodName, argsArray) {
  if (!methodName) { throw new Error('no methodName provided'); }

  this.forEach(function (entity) {
    if (entity[methodName]) {
      entity[methodName].apply(entity, argsArray);
    }
  });
};
