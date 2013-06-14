require('scene.js');

Kane.LoadingScene = function (settings) {
  _.extend(this, settings);

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

  Kane.Scene.call(this, settings);
};

Kane.LoadingScene.prototype = Object.create(Kane.Scene.prototype);

Kane.LoadingScene.prototype.onUpdate = function (dT) {
  var allImages
    , allJSON;

  //check if this is the currentScene, if not do nothing
  if (this.name !== this.game.getCurrentScene().name) {
    return;
  } 

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
  
  //if all the images and json are in their respective caches, do something
  if (allImages && allJSON) {
    this.loadComplete();
  } else {
    this.stillLoading();
  }
};

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
