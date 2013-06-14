Kane.ImageLoader = function (settings) {
  Kane.Loader.call(this, settings);

  this.loading = {};
};

Kane.ImageLoader.prototype = Object.create(Kane.Loader.prototype);

Kane.ImageLoader.prototype.loadAsset = function (fileName) {
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

  this.loading[name] = newImage;
};

function stripExtension (name) {
  return name.match(/(.*)\..*/)[1];
};
