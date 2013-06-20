/*
define a namespace
this object will hold EVERYTHING in your app
window.MyNameSpace = {};
*/

/*
first, require externally defined objects and the engine
require('engine.js');
require('ingameScene.js');
*/

/*
define a game object
this object will require a object of scenenames as strings
these strings must match be camelcase versions of objects
defined on your namespace object
E.G.
MyNameSpace.TestScene should be "testScene"
the game object optionally takes:  
cache object
loader object
clock object
inputWizard object

if not provided to constructor, they will be created for
you using Kane.X objects

E.G

MyNameSpace.game = new Kane.Game({
  namespace: MyNameSpace,
  scenes: ['Index', 'Ingame']
});
*/

window.Test = {};

require('engine.js');
require('game/index.js');
require('game/ingame.js');
require('game/tower.js');

Test.game = new Kane.Game({
  namespace: Test,
  sceneNames: ['Index', 'Ingame']
});

Test.game.start();
