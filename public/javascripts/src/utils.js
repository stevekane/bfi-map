require('kane.js');

Kane.Utils = {
  generateColor: function () {
    return "#" + Math.random().toString(16).slice(2, 8);
  },

  validateColor: function (color) {
    var validColor = /^#[0-9a-f]{3}$|[0-9a-f]{6}$/i;

    return validColor.test(color);
  },

  stripExtension: function (name) {
    return name.slice(0, name.indexOf('.'));
  },

  updatePosition: function (dT, v, oldPos) {
    return oldPos + dT * v; 
  },

  updateVelocity: function (dT, a, oldVel) {
    return oldVel + dT * a; 
  },
}
