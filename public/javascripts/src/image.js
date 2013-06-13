var ImageInterface = {
  load: function () {},

  //public interface attributes
  data: null,
  isLoaded: false,
  didError: false,
  height: null,
  width: null  
};

Kane.Image = function (settings) {
  if (!settings.fileName) {
    throw new Error('no fileName provided in settings');
  }

  _.extend(this, settings);

  this.data = new Image();

  this.data.onload = function () {
    this.isLoaded = true;
    this.height = this.data.height;
    this.width = this.data.width;
    this.onLoad();
  }.bind(this);

  this.data.onerror = function () {
    this.didError = true;
    this.onError();
  }.bind(this);

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
  //reset our loading variables
  this.didError = false;
  this.isLoaded = false;
  //set the src value to initiate browser http load attempt
  this.data.src = this.fileName; 
}; 

Kane.Image.prototype.onLoad = function () {
  
};

Kane.Image.prototype.onError = function () {

};
