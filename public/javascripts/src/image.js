var ImageInterface = {
  load: function () {},

  //public interface attributes
  data: null,
  origin: window.location.origin,
  isLoaded: false,
  didError: false,
  height: null,
  width: null  
};

Kane.Image = function (settings) {
  if (!settings.fileName) {
    throw new Error('no fileName provided in settings');
  }

  //define the origin before loading settings in case 
  //an origin is defined in the settings
  this.origin = window.location.origin;

  _.extend(this, settings);

  this.data = new Image();
  this.data.onload = this.onLoad;
  this.data.onerror = this.onError;
  this.data.onload = this.onLoad;

  this.isLoaded = false;
  this.didError = false;

  this.height = null;
  this.width = null;

  if (true == settings.autoLoad) {
    this.load();
  }
};

Kane.Image.prototype = Object.create(ImageInterface);

Kane.Image.prototype.load = function () {
  this.data.src = this.fileName; 
}; 

Kane.Image.prototype.onLoad = function () {};
Kane.Image.prototype.onError = function () {};
