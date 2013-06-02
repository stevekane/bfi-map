window.Kane = {};

require('game.js');
require('drawplane.js');
require('player.js');
require('entitymanager.js');

var canvas = document.createElement('canvas');
canvas.id = "board";
canvas.height = 480;
canvas.width = 640;

document.body.appendChild(canvas);
var canvasInDom = document.getElementById('board'); 

var board = new Kane.DrawPlane(canvasInDom);
var game = new Kane.Game();
var player = new Kane.Player();

board.fillAll('#123456');

game.start();
