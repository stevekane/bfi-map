window.Kane = {};

require('clock.js');
require('game.js');
require('world.js');
require('scene.js');
require('drawplane.js');
require('entity.js');
require('entitymanager.js');
require('inputwizard.js');

function createCanvas (w, h, name) {
  var canvas = document.createElement('canvas');
  
  canvas.id = name;
  canvas.height = h;
  canvas.width = w;
  
  document.body.appendChild(canvas);

  return document.getElementById(name);
};

//global background canvas object
var bgCanvas = createCanvas(640, 480, 'gameboard')
  , bgPlane = new Kane.DrawPlane(bgCanvas);

//color background
bgPlane.fillAll(generateColor());

//input wizard configuration
//we will add our subscriber from the scene instance
var inputWizard = new Kane.InputWizard();
inputWizard.attachToDomNode(document.body)
           .activateKeyboardForDomNode(document.body);

//Construction of specific scene
//setup entity set for this scene
var entityCanvas = createCanvas(640, 480, 'entities')
  , entityPlane = new Kane.DrawPlane(entityCanvas)
  , entityManager = new Kane.EntityManager(entityPlane)
  , clock = new Kane.Clock()
  , game = new Kane.Game({
    clock: clock
  });

//pass in our inputWizard and our entityManager
var ingame = new Kane.Scene(
  'ingame', 
  {
    inputWizard: inputWizard, 
    entityManager: entityManager
  }
);

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

//hacky mapping of keyname to dx/dy values
ingame.keynameVelocityMapping = {
  left: {
    dx: -1,
    dy: 0 
  },
  right: {
    dx: 1,
    dy: 0 
  },
  up: {
    dx: 0,
    dy: -1
  },
  down: {
    dx: 0,
    dy: 1 
  },
};

//setup inputHandling for ingame
ingame.keyup = function (keyName) {
  var mapping = this.keynameVelocityMapping[keyName];

  //add a check for the escape key
  if ('escape' === keyName) {
    this.game.setCurrentScene('inmenu');
  }

  if (mapping) {
    var dx = mapping.dx * Math.random()
      , dy = mapping.dy * Math.random();
 
    this.entityManager.spawn(
      Kane.Entity, 
      {
        drawplane: entityPlane,
        x: 300,
        y: 240,
        dx: dx,
        dy: dy,
        w: Math.floor(Math.random() * 40),
        h: Math.floor(Math.random() * 40),
        ddy: .001,
        color: generateColor()
      }
    );
  }
};

//pass in our inputWizard and our entityManager
var inmenu = new Kane.Scene(
  'inmenu', 
  {
    inputWizard: inputWizard, 
  }
);

//define onEnter hook to subscribe to inputWizard
inmenu.onEnter = function () {
  console.log('inmenu entered!');
  this.inputWizard.addSubscriber(this);
};

//define onExit hook to un-subscribe to inputWizard
inmenu.onExit = function () {
  console.log('inmenu exited!');
  this.inputWizard.removeSubscriber(this);
};

inmenu.keyup = function (keyName) {
  if ('escape' === keyName) {
    this.game.setCurrentScene('ingame');
  }
};

//configure the game object before starting it
game.addScene(ingame);
game.addScene(inmenu);
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
