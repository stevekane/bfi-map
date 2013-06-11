var WorldInterface = {};

Kane.World = function (settings) {
  _.extend(this, settings);
};

Kane.World.prototype = Object.create(WorldInterface);

