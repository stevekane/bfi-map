var CacheInterface = {
  cache: function (name, item) {},
  getByName: function (name) {},
};

Kane.Cache = function (settings) {
  _.extend(this, settings);

  this.store = {};
};

Kane.Cache.prototype = Object.create(CacheInterface);

Kane.Cache.prototype.cache = function (object) {
  if (!object.name) {
    throw new Error('no name provided for the object');
  }
  if (!object.asset) {
    throw new Error('no asset provided for the object');
  }
  this.store[object.name] = object.asset; 
};

Kane.Cache.prototype.getByName = function (name) {
  return this.store[name];
};
