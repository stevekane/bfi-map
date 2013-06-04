window.Kane = {};

require('game.js');
require('drawplane.js');
require('entity.js');
require('entitymanager.js');

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

function createGame (entityManager) {
  return new Kane.Game(entityManager);
};

var bgCanvas = createCanvas(640, 480, 'gameboard')
  , bgPlane = createDrawPlane(bgCanvas)
  , entityCanvas = createCanvas(640, 480, 'entities')
  , entityPlane = createDrawPlane(entityCanvas)
  
  , entities = createEntities(entityPlane, 200)
  , entityManager = createEntityManager(entities, entityPlane)
  , game = createGame(entityManager)
  , entityCount = 200;

//color background
bgPlane.fillAll('#123aaa');

//create entities 
for (var i=0; i<entityCount; i++) {
  entityManager.activateFromStore({
    x: Math.floor(Math.random() * 40),
    y: Math.floor(Math.random() * 40),
    h: 20,
    w: 20,
    dx: Math.random()/10,
    dy: Math.random()/10 
  });
}

game.start();
