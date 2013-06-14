require('loader.js');

//WE EXTEND LOADER

Kane.JSONLoader = function (settings) {
  Kane.Loader.call(this, settings); 
  
  this.loading = {};
};

Kane.JSONLoader.prototype = Object.create(Kane.Loader.prototype);

Kane.JSONLoader.prototype.loadAsset = function (fileName) {
  var name = Kane.Utils.stripExtension(fileName)
    , ajax
    , ajaxStream;

  if (!fileName) {
    throw new Error('no fileName provided to loadImage');
  }

  //assign ajax var to initiate request
  ajax = $.getJSON(fileName);
  //create an event stream from the ajax call
  ajaxStream = Bacon.fromPromise(ajax); 
  //define stream behaviors for success/error
  ajaxStream.onError(function () {
    this.handleError({
      name: name,
      asset: {}
    });
  }.bind(this));

  ajaxStream.onValue(function (json) {
    this.broadcast({
      name: name,
      asset: json 
    });
  }.bind(this));

  //store them as k/v pairs 
  this.loading[name] = {};
};
