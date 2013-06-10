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
var ingame = new Kane.Scene('ingame', {
  inputWizard: inputWizard, 
  entityManager: entityManager 
});

//subscribe our scene to the inputWizard
ingame.inputWizard.addSubscriber(ingame);

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
        w: 40,
        h: 40,
        ddy: .001,
        color: generateColor()
      }
    );
  }
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
