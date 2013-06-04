var EntityManagerInterface = {
  activateFromStore: function () {},
  deactivate: function (entity) {},
};

//requires array of entities
Kane.EntityManager = function (entities) {
  if (!entities) { throw new Error('must provide array of entities'); }

  this.store = entities;
  this.active = [];
};

Kane.EntityManager.prototype = Object.create(EntityManagerInterface);

Kane.EntityManager.prototype.activateFromStore = function (settings) {
  var storeEntity;
  if (!settings) { throw new Error('no settings hash provided!'); }
  if (0 === this.store.length) { throw new Error('store is empty!'); }

  storeEntity = this.store.shift();

  //set this entity's active flag
  storeEntity.activate(settings);

  //add store entity to active array
  this.active.unshift(storeEntity);
};

Kane.EntityManager.prototype.deactivate = function (entity) {
  var activeEnt;
  if (!entity) { throw new Error('no entity provided to deactivate'); } 

  activeEnt = this.active.filter(function (ent) { return entity === ent })[0]; 
  if (!activeEnt) { throw new Error('entity not found in active!'); }
  
  //weird method to target this element and remove it
  removeElement(activeEnt, this.active);  
  this.store.unshift(activeEnt);
};

function removeElement (element, array) {
  array.splice(array.indexOf(element), 1);
};
