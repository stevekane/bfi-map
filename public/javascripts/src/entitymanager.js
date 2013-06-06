var EntityManagerInterface = {
  activateFromStore: function (settings) {},
  deactivate: function (entity) {},
  updateActive: function (dT) {},
  drawActive: function () {},
  updatePlayer: function (dT) {},
  drawPlayer: function () {}
};

//requires array of entities
Kane.EntityManager = function (entities, drawplane, player) {
  if (!entities) { throw new Error('must provide array of entities'); }
  if (!drawplane) { throw new Error('must provide drawplane'); }
  if (!player) { throw new Error('must provide player'); }
  
  this.store = entities;
  this.drawplane = drawplane;
  this.player = player;
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

  //call entity's deactivate method
  activeEnt.deactivate();
  this.store.unshift(activeEnt);
};

Kane.EntityManager.prototype.updateActive = function (dT) {
  if (undefined == dT) { throw new Error('no dT provided to updateActive'); }

  this.active.forEach(function (entity) { 
    entity.update(dT); 
  });
};

Kane.EntityManager.prototype.drawActive = function () {
  this.drawplane.clearAll();
  this.active.forEach(function (entity) { 
    entity.draw(); 
  });
};

Kane.EntityManager.prototype.updatePlayer = function (dT) {
  if (undefined == dT) { throw new Error('no dT provided to updateActive'); }

  this.player.processInputs();
  this.player.update(dT);
};

Kane.EntityManager.prototype.drawPlayer = function () {
  this.player.draw();
};

function removeElement (element, array) {
  array.splice(array.indexOf(element), 1);
};

