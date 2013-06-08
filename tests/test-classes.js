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

  createEntity: function (args) {
    return new Kane.Entity(args);
  },

  createPlayer: function (drawplane, inputQueue) {
    return new Kane.Player(drawplane, inputQueue);
  },

  createEntities: function (args, count) {
    var ents = [];
  
    for (var i=0; i<count; i++) {
      ents.push(this.createEntity(args)); 
    }
    return ents;
  },
  
  createEntityManager: function (drawplane) {
    return new Kane.EntityManager(drawplane);
  },  

  createInputEvent: function (type, data) {
    return new Kane.InputEvent(type, data);
  },

  createInputQueue: function () {
    return new Kane.InputQueue(); 
  },
};
