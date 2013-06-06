window.Test = {
  createDrawPlane: function (name) {
    var drawPlane
      , domNode
      , canvas = document.createElement('canvas');

    canvas.id = name;
    document.body.appendChild(canvas);
    domNode = document.getElementById(name); 
    return new Kane.DrawPlane(domNode);
  }, 

  createEntity: function (drawplane) {
    return new Kane.Entity(drawplane);
  },

  createPlayer: function (drawplane, inputQueue) {
    return new Kane.Player(drawplane, inputQueue);
  },

  createEntities: function (drawplane, count) {
    var ents = [];
  
    for (var i=0; i<count; i++) {
      ents.push(this.createEntity(drawplane)); 
    }
    return ents;
  },
  
  createEntityManager: function (entities, drawplane, player) {
    return new Kane.EntityManager(entities, drawplane, player);
  },  

  createInputEvent: function (type, data) {
    return new Kane.InputEvent(type, data);
  },

  createInputQueue: function () {
    return new Kane.InputQueue(); 
  },
};
