window.Kane = {};

//"utility objects"
require('clock.js');
require('loader.js');
require('cache.js');

//"dom objects"
require('inputwizard.js');
require('drawplane.js');

//"high levl objects"
require('game.js');
require('scene.js');
require('world.js');

//"entity objects"
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

//global background canvas object
var bgCanvas = createCanvas(640, 480, 'gameboard')
  , bgPlane = new Kane.DrawPlane({board: bgCanvas});

//color background
//bgPlane.fillAll(generateColor());

//input wizard configuration
//we will add our subscriber from the scene instance
var inputWizard = new Kane.InputWizard();
inputWizard.attachToDomNode(document.body)
           .activateKeyboardForDomNode(document.body);

//Construction of specific scene
//setup entity set for this scene
var entityCanvas = createCanvas(640, 480, 'entities')
  , entityPlane = new Kane.DrawPlane({board: entityCanvas})
  , entityManager = new Kane.EntityManager({drawplane: entityPlane})
  , clock = new Kane.Clock()
  , game = new Kane.Game({
    clock: clock
  });

//setup loader/cache
var cache = new Kane.Cache();
var loader = new Kane.Loader({cache: cache});

//pass in our inputWizard and our entityManager
var ingame = new Kane.Scene({
  name: 'ingame',
  inputWizard: inputWizard, 
  entityManager: entityManager,
  cache: cache,
  loader: loader
});

/*
ALL BACON ACTIVITY USES DOM ELEMENTS DEFINED IN THE HTML DOC
THIS IS JUST TEMPORARY AND CAUSES TESTS TO FAIL
*/
//BACON STATS SETUP
ingame.entityManager.baconLength = new Bacon.Bus();
ingame.entityManager.baconCollisions = new Bacon.Bus();

//BACON STAT PUSHING BEHAVIOR
ingame.onUpdate = function (dT) {
  var emLen = this.entityManager.length
    , collisions = this.entityManager.findCollisions();

  this.entityManager.baconLength.push(emLen);
  this.entityManager.baconCollisions.push(collisions.length);
};

//Assign bacon stat streams to behaviors that render in the DOM
var entCount = document.getElementById('entityCount')
  , colCount = document.getElementById('collisionCount');

/*
we wrap this in a conditional for the time being to avoid
failing tests (the test runner uses a generated .html file
and not the index.html file where these two dom elements are
defined
*/
if (entCount && colCount) {

  entityManager.baconLength.onValue(function (val) {
    entCount.textContent = val;  
  });

  entityManager.baconCollisions.onValue(function (val) {
    colCount.textContent = colCount.textContent ? 
                           parseInt(colCount.textContent) + val : 
                           val;
  });
}


//define onEnter hook to subscribe to inputWizard
ingame.onEnter = function () {
  console.log('ingame entered!');
  this.inputWizard.addSubscriber(this);

  var spriteSheet = this.cache.getByName('public/images/spritesheet');
  console.log(spriteSheet);
  bgPlane.drawImage(spriteSheet, 0, 0);
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

  if (mapping) {
    var dx = mapping.dx * Math.random()
      , dy = mapping.dy * Math.random();
 
    this.entityManager.spawn(
      Kane.Entity, 
      {
        x: Math.round(Math.random() * 640),
        y: Math.round(Math.random() * 480),
        dx: dx,
        dy: dy,
        w: 40,
        h: 40,
        ddy: .001,
        color: '#1356ab',
        killtimer: Date.now() + 2000,

        //introduce afterupdate method to check if we should kill
        afterUpdate: function (dT) {
          if (Date.now() > this.killtimer) {
            this.kill();   
          }
        },

        collide: function (target) {
          this.kill();
          target.kill();
          
          for (var i=0; i<20; i++) {
            this.manager.spawn(
              Kane.Entity, 
              {
                doesCollide: false,
                x: this.x,
                y: this.y,
                dx: Math.random() * (this.dx + target.dx),
                dy: Math.random() * (this.dy + target.dy),
                w: 8,
                h: 8,
                ddy: .001,
                color: "#bb0000",
                killtimer: Date.now() + 500,

                //introduce afterupdate method to check if we should kill
                afterUpdate: function (dT) {
                  if (Date.now() > this.killtimer) {
                    this.kill();   
                  }
                },
              }
            ); 
          }
        }
      }
    );
  }
};

var loading = new Kane.Scene({
  name: 'loading',
  loader: loader,
  cache: cache
});

loading.loader.loadImage('public/images/spritesheet.png');

loading.onEnter = function () {
  console.log('loading');
};

loading.onExit = function () {
  console.log('loading complete');
};

loading.onUpdate = function () {
  var spriteSheet = this.cache.getByName('public/images/spritesheet');
 
  //if we are ingame, dont worry about this methods further checks 
  if ('ingame' == this.game.getCurrentScene().name) {
    return;
  }

  if (spriteSheet) {
    this.game.setCurrentScene('ingame'); 
  } else {
    console.log('...');
  }
};


//configure the game object before starting it
game.addScene(ingame);
game.addScene(loading);
game.setCurrentScene('loading');

game.start();

function generateColor () {
  return "#" + Math.random().toString(16).slice(2, 8);
};
