require('kane.js');

var CacheInterface = {
  cache: function (name, asset) {},
  flushByName: function (name) {},
  flush: function () {},
  getByName: function (name) {},
  allInCache: function (nameArray) {},
};

Kane.Cache = function (settings) {
  _.extend(this, settings);

  this.store = {};
};

Kane.Cache.prototype = Object.create(CacheInterface);

Kane.Cache.prototype.cache = function (name, asset) {
  if (!name) {
    throw new Error('no name provided for the object');
  }
  if (!asset) {
    throw new Error('no asset provided for the object');
  }
  this.store[name] = asset; 
};

Kane.Cache.prototype.flushByName = function (name) {
  delete this.store[name];
};

Kane.Cache.prototype.flush = function () {
  this.store = {};
};

Kane.Cache.prototype.getByName = function (name) {
  return this.store[name];
};

/*
this is most often used by objects to determine if everything they
need is loaded and available in the cache
*/
Kane.Cache.prototype.allInCache = function (nameArray) {
  return _(nameArray).every(function (name) {
    return Boolean(this.getByName(name));
  }, this);
};
