require('scene.js');

Kane.LoadingScene = function (settings) {
  Kane.Scene.call(this, settings);

  if (!settings.cache) {
    throw new Error('no cache provided');
  }

  if (!settings.loader) {
    throw new Error('no loader provided');
  }

  if (!settings.targetSceneName) {
    this.targetSceneName = this.name;
  }
};

Kane.LoadingScene.prototype = Object.create(Kane.Scene.prototype);

Kane.LoadingScene.prototype.onEnter = function () {
  console.log('loading assets for ', this.targetSceneName);
  this.loader.loadAssets('ingameAssets', this.assets, loadingComplete.bind(this));
};

Kane.LoadingScene.prototype.onExit = function () {
  console.log('transitioning from ', this.name, ' to', this.targetSceneName);
};

function loadingComplete (errors) {
  if (0 < errors.length) {
    console.log(errors, ' failed to load');
  } else {
    this.game.setCurrentScene(this.targetSceneName);
  }
};
