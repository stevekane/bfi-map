/*
update and draw generally should be left alone.  they both expose hooks
for calling onUpdate and onDraw which may be defined however you desire

onEnter and onExit may be defined to do w/e you desire and they will be called
by the game object that owns this scene on scene transitions 
*/
var SceneInterface = {
  update: function (dT) {},
  draw: function () {},
  onEnter: function () {},
  onExit: function () {},
  onDraw: function () {},
  onUpdate: function (dT) {},
  
  //list of required attributes
  name: ""
};

/*
note, if the settings provided include a name it will be overwritten
by the provided name 
*/
Kane.Scene = function (name, settings) {
  //apply settings object to this scene
  _.extend(this, settings);

  this.name = name;

  //this will be toggled by the game that owns this scene
  this.isActive = false;
};

Kane.Scene.prototype = Object.create(SceneInterface);

Kane.Scene.prototype.update = function (dT) {
  if (!dT) { 
    throw new Error('no dT provided to update'); 
  }

  if (this.entityManager) { 
    this.entityManager.updateAll(dT);  
  } 

  this.onUpdate(dT);
};

Kane.Scene.prototype.draw = function () {
  if (this.entityManager) {
    this.entityManager.drawAll();
  }

  this.onDraw();
};

Kane.Scene.prototype.onEnter = function () {};
Kane.Scene.prototype.onExit = function () {};
Kane.Scene.prototype.onUpdate = function (dT) {};
Kane.Scene.prototype.onDraw = function () {};
