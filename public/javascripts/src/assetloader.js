/*
Asset loaders is solely responsible for reaching out to the server
to retrive assets for use in the game.  

FILETYPES SUPPORTED:
.json - LoadJson
.png - LoadPng
.jpg - LoadJpg

As files are loaded, events are pushed onto the bus of two types

{
  type: 'load' || 'failedToLoad',
  name: 'myAsset.ext'
  asset: JSObj
}

The scene instance that owns this loader should subscribe to the bus

*/


require('kane.js');

var AssetLoaderInterface = {

};

Kane.AssetLoader = function (settings) {
  
};

Kane.AssetLoader.prototype = Object.create(AssetLoaderInterface);
