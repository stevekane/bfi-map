window.Kane = {};

require('game.js');
require('drawplane.js');
require('entity.js');
require('entitymanager.js');
require('inputevent.js');
require('inputqueue.js');
require('inputmanager.js');

function createCanvas (w, h, name) {
  var canvas = document.createElement('canvas');
  
  canvas.id = name;
  canvas.height = h;
  canvas.width = w;
  
  document.body.appendChild(canvas);

  return document.getElementById(name);
};

function createDrawPlane (canvas) {
  return new Kane.DrawPlane(canvas);
};

function createInputQueue () {
  return new Kane.InputQueue();
};

//note, domNode is NOT a drawplane but the node itself
function createInputManager (inputQueue, domNode) {
  return new Kane.InputManager(inputQueue, domNode);
};

function createEntities (drawplane, count) {
  var ar = [];

  for (var i=0; i<count; i++) {
    ar.push(new Kane.Entity(drawplane)); 
  }
  
  return ar;
};

function createEntityManager (entities, drawplane) {
  return new Kane.EntityManager(entities, drawplane);
};

function createGame (entityManager, inputQueue) {
  return new Kane.Game(entityManager, inputQueue);
};

var entityCount = 2000 
  , bgCanvas = createCanvas(640, 480, 'gameboard')
  , bgPlane = createDrawPlane(bgCanvas)
  , entityCanvas = createCanvas(640, 480, 'entities')
  , entityPlane = createDrawPlane(entityCanvas)

  , inputQueue = createInputQueue()
  , inputManager = createInputManager(inputQueue)

  , entities = createEntities(entityPlane, entityCount)
  , entityManager = createEntityManager(entities, entityPlane)
  , game = createGame(entityManager, inputQueue);

//turn on input listeners
inputManager.activateKeyUpHandler();
inputManager.activateKeyDownHandler();

//color background
bgPlane.fillAll('#123aaa');

//create entities 
for (var i=0; i<entityCount/2; i++) {
  entityManager.activateFromStore({
    x: 0,
    y: 480,
    h: Math.floor(Math.random() * 40),
    w: Math.floor(Math.random() * 40),
    dx: Math.random() / 10,
    dy: -1 * Math.random(),
    ddy: .0005,
    color: generateColor()
  });
}
for (var i=0; i<entityCount/2; i++) {
  entityManager.activateFromStore({
    x: 640,
    y: 480,
    h: 20,
    w: 20,
    dx: -Math.random()/10,
    dy: -1 * Math.random(),
    ddy: .0005,
    color: generateColor()
  });
}

function generateColor () {
  return "#" + Math.random().toString(16).slice(2, 8);
};

game.start();
