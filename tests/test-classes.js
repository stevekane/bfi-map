window.Test = {
  createDrawPlane: function (name) {
    var drawPlane
      , domNode
      , $canvas = $(document.createElement('canvas'));

    $canvas.attr({id: name});
    $('body').append($canvas);
    return new Kane.DrawPlane({board: $canvas});
  }, 
};
