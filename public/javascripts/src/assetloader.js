/*
Asset loaders is solely responsible for reaching out to 
the server to retrive assets for use in the game.  

FILETYPES SUPPORTED:
.json  
.png
.jpg
*/

require('kane.js');
require('utils.js');

var AssetLoaderInterface = {
  loadAssets: function (groupName, assets, callback) {} 
};

Kane.AssetLoader = function (settings) {
  if (!settings.cache) {
    throw new Error('no cache provided to constructor');
  } 

  /*
  all are k/v pairs 
  k = groupName, v = remaining assets to load from that group
  k = groupName, v = array of filenames that failed to load
  k = groupName, v = callback when group is loaded 
  */
  this.assetCounters = {};
  this.errors = {};
  this.callbacks = {};

  _.extend(this, settings);
};

Kane.AssetLoader.prototype = Object.create(AssetLoaderInterface);

//format of callback is function (errors) {} where 
//errors is an arrayof filenames that failed to load
Kane.AssetLoader.prototype.loadAssets = function (groupName, assets, callback) {
  if (!groupName) {
    throw new Error('no groupName provided!');
  }
  if (!assets) {
    throw new Error('no assets provided!');
  }
  if (!callback) {
    throw new Error('no callback provided!');
  }

  var jsonAssets = _(assets).filter(filterByFileType('.json')).value()
    , pngAssets = _(assets).filter(filterByFileType('.png')).value()
    , jpgAssets = _(assets).filter(filterByFileType('.jpg')).value()
    , imageAssets = pngAssets.concat(jpgAssets);

  //set assetCounter, errors, and callback for this group
  initializeGroup(this, groupName, assets.length, callback);

  //call our load JSON function
  loadJSON(this, jsonAssets, groupName);

  //call our load Images function
  loadImages(this, imageAssets, groupName);
};

function loadJSON (loader, assetNames, groupName) {
  //console.log('inside loadJSON with ', assetNames, groupName);
  for (var i=0; i<assetNames.length; i++) {
    var assetName = assetNames[i];  

    $.getJSON(assetName)
      .done(function (json) {
        //cache the asset
        loader.cache.cache(Kane.Utils.stripFilePath(assetName), json);
      })
      .fail(function () {
        //push assetName onto errors array
        loader.errors[groupName].push(assetName);
      })
      .always(function () {
        //decrease this groups assetCount
        loader.assetCounters[groupName]--;
        //check if this group is done loading
        checkIfGroupIsDone(loader, groupName);
      });
  };
};

/*
function that takes a loader class, a list of assetNames, 
and a groupName it creates an Image object, initiates an 
XHR for the image, and sets up callbacks for successful 
load and error
*/
function loadImages (loader, assetNames, groupName) {
  for (var i=0; i<assetNames.length; i++) {
    var assetName = assetNames[i]
      , img = new Image();

    img.src = assetName;

    //load callback
    img.onload = function () {
      //cache the image asset
      loader.cache.cache(Kane.Utils.stripFilePath(assetName), img);

      //decrease this groups assetCount
      loader.assetCounters[groupName]--;

      //check if group is done loading
      checkIfGroupIsDone(loader, groupName);
    };

    //error callback
    img.onerror = function () {
      //push assetName onto errors array
      loader.errors[groupName].push(assetName);
      
      //decrease this groups assetCount
      loader.assetCounters[groupName]--;

      //check if this group is done loading
      checkIfGroupIsDone(loader, groupName);
    };
  }
};

//initialize a loader's assetCounter, errors, and callback
function initializeGroup (loader, groupName, assetsLength, callback) {
  loader.assetCounters[groupName] = assetsLength;
  loader.errors[groupName] = [];
  loader.callbacks[groupName] = callback;
};

/*
if a group's asset counter is 0 then there 
are no more items to load so call that group's callback 
and pass in the content of that groups errors
*/
function checkIfGroupIsDone(loader, groupName) {
  var callback = loader.callbacks[groupName]
    , errors = loader.errors[groupName]
    , assetCounter = loader.assetCounters[groupName];

  if (0 === assetCounter) {
    callback(errors);
  }  
};

//pass a file extension (including ".") and it will return a filter function
function filterByFileType (extension) {
  return function (name) {
    return (-1 !== name.indexOf(extension)); 
  };
};
