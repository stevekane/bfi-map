var LoaderInterface = {
  loadImage: function (fileName) {},
  handleError: function (name, image) {},
  broadcast: function (object) {},

  //public interface attributes
  loading: {},
  bus: null
};

Kane.Loader = function (settings) {
  if (!settings.cache) {
    throw new Error('no cache provided in settings');
  }
  if (!settings.bus) {
    throw new Error('no bus provided in settings');
  } 

  _.extend(this, settings);

  this.loading = {}; 
};

Kane.Loader.prototype = Object.create(LoaderInterface);

Kane.Loader.prototype.loadImage = function (fileName) {
  var newImage = new Image()
    , name = stripExtension(fileName);
  
  if (!fileName) {
    throw new Error('no fileName provided to loadImage');
  }

  //callback defined in scope w/ this new image
  function onLoad () {
    this.broadcast({
      name: name,
      asset: newImage
    });
  }

  function onError () {
    this.handleError({
      name: name,
      asset: newImage
    });
  }

  //setting the src will immediatly trigger a server request
  newImage.onload = onLoad.bind(this);
  newImage.onerror = onError.bind(this);
  newImage.src = fileName;

  //store them as k/v pairs 
  this.loading[name] = newImage;
};

//this is generally called by Image onerror callbacks
Kane.Loader.prototype.handleError = function (object) {
  if (!object.name) {
    throw new Error('no name provided');
  }
  if (!object.asset) {
    throw new Error('no asset provided');
  }

  delete this.loading[object.name];
};

Kane.Loader.prototype.broadcast = function (object) {
  if (!object.name) {
    throw new Error('no name provided'); 
  } 
  if (!object.asset) {
    throw new Error('no asset provided'); 
  } 

  /*
  push this object onto the bus.  Anyone subscribing to this bus
  will see this object and may respond as they desire
  */
  this.bus.push(object);

  //remove this asset from the loading object
  delete this.loading[object.name];
};

function stripExtension (name) {
  return name.match(/(.*)\..*/)[1];
};
