var LoaderInterface = {
  loadImage: function (fileName) {},
  pushToCache: function (name, image) {},
  handleError: function (name, image) {},

  //public interface attributes
  loading: {}
};

Kane.Loader = function (settings) {
  if (!settings.cache) {
    throw new Error('no cache provided in settings');
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
    this.pushToCache(name, newImage);
  }

  function onError () {
    this.handleError(name, newImage);
  }

  //setting the src will immediatly trigger a server request
  newImage.onload = onLoad.bind(this);
  newImage.onerror = onError.bind(this);
  newImage.src = fileName;

  //store them as k/v pairs 
  this.loading[name] = newImage;
};

//this is generally called by Image onload callbacks
Kane.Loader.prototype.pushToCache = function (name, image) {
  if (!name) {
    throw new Error('no imageName provided');
  }
  
  //cache this image
  this.cache.cache(name, image);

  //delete this k/v pair from loading
  delete this.loading[name];
};

//this is generally called by Image onerror callbacks
Kane.Loader.prototype.handleError = function (name, image) {
  if (!name) {
    throw new Error('no imageName provided');
  }

  delete this.loading[name];
};

function stripExtension (name) {
  return name.match(/(.*)\..*/)[1];
};
