require('kane.js');

var WorldInterface = {
  loadData: function(data) {},

  //public facing interface attributes
  isLoaded: false,
};

Kane.World = function (settings) {
  //bus transmits world events
  if (!settings.bus) {
    throw new Error('no bus provided in settings to constructor');
  }

  //drawplane is a surface to draw our map onto
  if (!settings.drawplane) {
    throw new Error('no drawplane provided in settiungs to constructor');
  }
  _.extend(this, settings);

  this.isLoaded = false;
};

Kane.World.prototype = Object.create(WorldInterface);

Kane.World.prototype.loadData = function (data) {
  if (!data) {
    throw new Error('no data provided to load!');
  }

  this.data = data; 
  
  this.isLoaded = true;
};
