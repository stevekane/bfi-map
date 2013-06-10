window.Kane = {};

require('clock.js');
require('game.js');
require('scene.js');
require('drawplane.js');
require('entity.js');
require('entitymanager.js');
require('player.js');
require('inputevent.js');
require('inputqueue.js');
require('inputmanager.js');
require('inputwizard.js');

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

function createEntityManager (drawplane) {
  return new Kane.EntityManager(drawplane);
};

function createPlayer (drawPlane, inputQueue) {
  return new Kane.Player(drawPlane, inputQueue);
};

function createScene (name, settingsHash) {
  return new Kane.Scene(name, settingsHash);
};

function createGame () {
  return new Kane.Game();
};

/*

//global background canvas object
var bgCanvas = createCanvas(640, 480, 'gameboard')
  , bgPlane = createDrawPlane(bgCanvas);

//color background
bgPlane.fillAll(generateColor());

//Setup a basic inputManager and inputQueue
var inputQueue = createInputQueue()
  , inputManager = createInputManager(inputQueue);

//turn on input listeners
inputManager.activateKeyUpHandler();
inputManager.activateKeyDownHandler();

//Construction of specific scene
//setup entity set for this scene
var entityCanvas = createCanvas(640, 480, 'entities')
  , entityPlane = createDrawPlane(entityCanvas)
  , entityManager = createEntityManager(entityPlane)
  , clock = new Kane.Clock()
  , game = new Kane.Game({
    clock: clock
  });

//pass in our default input Queue and our entityManager
var ingame = new Kane.Scene('ingame', {
  inputQueue: inputQueue,
  entityManager: entityManager 
});

//setup inputHandling for ingame
ingame.processInput = function () {
  var events = this.inputQueue.fetchAllEvents();
  
  events.forEach(function (event) {
    this.entityManager.spawn(
      Kane.Entity,
      {
        drawplane: entityPlane,
        x: Math.floor(Math.random() * 640),
        y: Math.floor(Math.random() * 480),
        dx: Math.random(),
        dy: -1 * Math.random(),
        w: 40,
        h: 40,
        ddy: .001,
        color: generateColor()
      }
    );
  }, this); 
};

//configure the game object before starting it
game.addScene(ingame);
game.setCurrentScene('ingame');

//just a quick hack to show the scene name
var div = document.createElement('div');

div.id = 'scenename';
div.style.position = "absolute";
div.style.left = 100;
div.textContent = game.getCurrentScene().name;
document.body.appendChild(div);

game.start();

function generateColor () {
  return "#" + Math.random().toString(16).slice(2, 8);
};

*/
