require('scene.js');

Kane.LoadingScene = function (settings) {
  Kane.Scene.call(this, settings);

  if (!settings.targetSceneName) {
    this.targetSceneName = this.name;
  }
  //defaults
  this.imageCache = null;
  this.imageLoader = null;
  this.jsonCache = null;
  this.jsonLoader = null;
  this.imageAssets = [];
  this.jsonAssets = [];

  _.extend(this, settings);
};

Kane.LoadingScene.prototype = Object.create(Kane.Scene.prototype);

Kane.LoadingScene.prototype.onUpdate = function (dT) {
  var allImages
    , allJSON;

  //if we have an imageCache, check if all our images are loaded
  if (this.imageCache) {
    allImages = this.imageCache.allInCache(this.imageAssets);
  } else {
    allImages = true;
  }

  //if we have a jsonCache, check if all our json is loaded  
  if (this.jsonCache) {
    allJSON = this.jsonCache.allInCache(this.jsonAssets);
  } else {
    allJSON = true;
  }
  
  //if all images and json are loaded, do something
  if (allImages && allJSON) {
    this.loadComplete();
  } else {
    this.stillLoading();
  }
};

//broadcast our loadComplete to the scene bus
Kane.LoadingScene.prototype.loadComplete = function () {
  this.game.setCurrentScene(this.targetSceneName);
};

Kane.LoadingScene.prototype.stillLoading = function () {
  console.log('still loading...');
};

Kane.LoadingScene.prototype.onEnter = function () {
  console.log('loading assets for ', this.targetSceneName);
};

Kane.LoadingScene.prototype.onExit = function () {
  console.log('transitioning from ', this.name, ' to', this.targetSceneName);
};
