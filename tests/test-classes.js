window.Test = {
  createDrawPlane: function (name) {
    var drawPlane
      , domNode
      , canvas = document.createElement('canvas');

    canvas.id = name;
    document.body.appendChild(canvas);
    domNode = document.getElementById(name); 
    return new Kane.DrawPlane({board: domNode});
  }, 
};
