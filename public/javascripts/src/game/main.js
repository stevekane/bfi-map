require('engine.js');

function createCanvas (w, h, name) {
  var $canvas = $(document.createElement('canvas'));
  
  $canvas.attr({
    id: name,
    height: h,
    width: w
  }); 
  
  $('body').append($canvas);

  return $canvas;
};

//input wizard configuration
//we will add our subscriber from the scene instance
var inputWizard = new Kane.InputWizard();
inputWizard.attachToDomNode(document.body)
           .activateKeyboardForDomNode(document.body);

//setup image loader/cache/bus.  optionally we inject the bus onto 
//the cache to be more explicit about its dependencies
var imageBus = new Bacon.Bus();
var imageCache = new Kane.Cache({
  bus: imageBus 
});
var imageLoader = new Kane.ImageLoader({
  cache: imageCache,
  bus: imageBus 
});

//let's make our cache 'listen' to our loader's bus
imageCache.bus.onValue( function (object) {
  this.cache(object);
}.bind(imageCache));

//let's add another bus listener to log the loading 
imageCache.bus.onValue( function (object) {
  console.log(object.name, ' has been loaded successfully!');
});

//setup json loader/cache/bus.  optionally we inject the bus onto
//this cache to be more explicit about its dependencies
var jsonBus = new Bacon.Bus();
var jsonCache = new Kane.Cache({
  bus: jsonBus 
});
var jsonLoader = new Kane.JSONLoader({
  cache: jsonCache,
  bus:jsonBus 
});

//let's make our cache 'listen' to our loader's bus
jsonCache.bus.onValue( function (object) {
  this.cache(object);
}.bind(jsonCache));

//let's add another bus listener to log the loading
jsonCache.bus.onValue( function (object) {
  console.log(object.name, ' has been loaded successfully!');
});

/*
create our bus for scene -> game communication
this allows powerful pub/sub to scene change events etc
*/
var sceneBus = new Bacon.Bus();

/*
Construction of specific scene
setup entity set for this scene
*/
var entityCanvas = createCanvas(300, 300, 'entities')
  , entityPlane = new Kane.DrawPlane({board: entityCanvas})
  , bgCanvas = createCanvas(300, 300, 'gameboard')
  , bgPlane = new Kane.DrawPlane({board: bgCanvas})

  , entityManager = new Kane.EntityManager({drawplane: entityPlane});
/*
pass in our inputWizard and our entityManager
we also pass it a reference to our image/json cache
incase we wish to pull objects from them
*/
var ingame = new Kane.GameScene({
  name: 'ingame',
  inputWizard: inputWizard, 
  entityManager: entityManager,
  imageCache: imageCache,
  jsonCache: jsonCache,
  bus: sceneBus
});

//define camera for our ingameScene
var camera = new Kane.Camera({
  scene: ingame,
  planes: {
    entityPlane: entityPlane,
    bgPlane: bgPlane,
  },
  h: 540,
  w: 1000 
});

//assign the camera to a camera attribute on the scene
ingame.camera = camera;

/*
ALL BACON ACTIVITY USES DOM ELEMENTS DEFINED IN THE HTML DOC
THIS IS JUST TEMPORARY AND CAUSES TESTS TO FAIL
*/
//BACON STATS SETUP
ingame.entityManager.baconLength = new Bacon.Bus();
ingame.entityManager.baconCollisions = new Bacon.Bus();

//Assign bacon stat streams to behaviors that render in the DOM
var entCount = document.getElementById('entityCount')
  , colCount = document.getElementById('collisionCount');

entityManager.baconLength.onValue(function (val) {
  entCount.textContent = val;  
});

entityManager.baconCollisions.onValue(function (val) {
  colCount.textContent = colCount.textContent ? 
                         parseInt(colCount.textContent) + val : 
                         val;
});

//define onEnter hook to subscribe to inputWizard
ingame.onEnter = function () {
  console.log('ingame entered!');
  this.inputWizard.addSubscriber(this);
};

//define onExit hook to un-subscribe to inputWizard
ingame.onExit = function () {
  console.log('ingame exited!');
  this.inputWizard.removeSubscriber(this);
};

//define a timer to fire new objects (ms)
ingame.shotTimer = 200;

ingame.onUpdate = function (dT) {
  var emLen = this.entityManager.length
    , collisions = this.entityManager.findCollisions();

  this.entityManager.baconLength.push(emLen);
  this.entityManager.baconCollisions.push(collisions.length);

  if (!this.lastShotFired) {
    this.lastShotFired = Date.now();
  } else {
    if ((this.lastShotFired + this.shotTimer) < Date.now()) {
      this.fire(0, 400, Math.random(), -1 * Math.random());
      this.fire(640, 400, -1 * Math.random(), -1 * Math.random());
      this.lastShotFired = Date.now();
    }
  }
};

//DEFINE utility method
ingame.fire = function (x, y, dx, dy) {
  var spriteSheet = this.imageCache.getByName('public/images/spritesheet')
    , json = this.jsonCache.getByName('public/json/spritesheet')
    , data = json.frames['grapebullet.png'].frame
    , sprite = new Kane.Sprite({
        image: spriteSheet,
        sx: data.x,
        sy: data.y,
        w: data.w,
        h: data.h
    });

  this.entityManager.spawn(
    Kane.Projectile,
    {
      currentSprite: sprite,
      x: x,
      y: y,
      dx: dx,
      dy: dy,
      ddy: .001,
      h: 30,
      w: 30,
    }
  );
};

ingame.keyup = function (keyName) {
};

/*
this is a loading scene.  It will load assets into the provided
caches using the provided loaders and then advance to ingame
*/

var index = new Kane.LoadingScene({
  name: 'index',
  targetSceneName: 'ingame',

  imageLoader: imageLoader,
  imageCache: imageCache,
  imageAssets: ['public/images/spritesheet'],

  jsonLoader: jsonLoader,
  jsonCache: jsonCache,
  jsonAssets: ['public/json/spritesheet'],

  bus: sceneBus
});

index.imageLoader.loadAsset('public/images/spritesheet.png');
index.jsonLoader.loadAsset('public/json/spritesheet.json');

var clock = new Kane.Clock()
  , game = new Kane.Game({
      clock: clock,
      scenes: {
        index: index,
        ingame: ingame
      },
      //TODO THIS MUST BE REMOVED???
      bus: sceneBus
  });

/*
configure our bus to listen for transition type events
bus format is defined as {type: string, content: object}
*/
game.bus.onValue(function (ev) {
  var type = ev.type
    , name = ev.content.name;

  if ('transition' === type) {
    this.setCurrentScene(name);
  }

}.bind(game));

game.start();
