/*
Towers are entities that never move but will
shoot projectiles at the player every so often
*/
require('entity.js');

Test.Tower = function (settings) {
  Kane.Entity.call(this, settings);

  //for the time being, towers do not collide
  this.doesCollide = false;

  //time between shots
  this.shotTimer = 100;
};

Test.Tower.prototype = Object.create(Kane.Entity.prototype);

//our tower will check 
Test.Tower.prototype.beforeUpdate = function () {
  if (!this.target) {
    this.target = getTarget(this);
  } 
};

function checkForTarget(tower) {
  return tower.manager.player ? tower.manager.player : null;
};
