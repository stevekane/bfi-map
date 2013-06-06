require('inputevent.js');

var InputManagerInterface = {
  handleInputEvent: function () {},
  activateKeyUpHandler: function () {},
  activateKeyDownHandler: function () {},
  getActiveHandlers: function () {},
};

Kane.InputManager = function (inputQueue, domNode) {
  if (!inputQueue) { 
    throw new Error('no inputQueue provided to constructor'); 
  }
  this.inputQueue = inputQueue;
  this.domNode = (domNode) ? domNode : document.body;
  this.activeHandlers = [];
};

Kane.InputManager.prototype = Object.create(InputManagerInterface);

//type is a string, data is an object
Kane.InputManager.prototype.handleInputEvent = function (type, data) {
  var inputEvent;
  if (!type) { throw new Error('must provide type to handleInputEvent'); }
  if (!data) { throw new Error('must provide data to handleInputEvent'); }

  inputEvent = new Kane.InputEvent(type, data);
  this.inputQueue.enqueueEvent(inputEvent);
};

Kane.InputManager.prototype.activateKeyUpHandler = function () {
  //do nothing is keyUpHandler already active
  if (searchForMatch(this.activeHandlers, keyUpHandler)) { return; }

  this.activeHandlers.push(keyUpHandler); 
  this.domNode.addEventListener('keyup', keyUpHandler.bind(this));
};

Kane.InputManager.prototype.activateKeyDownHandler = function () {
  //do nothing is keyUpHandler already active
  if (searchForMatch(this.activeHandlers, keyDownHandler)) { return; }

  this.activeHandlers.push(keyDownHandler); 
  this.domNode.addEventListener('keydown', keyDownHandler.bind(this));
};

Kane.InputManager.prototype.getActiveHandlers = function () {
  return this.activeHandlers;
};

//helper to search an array for an element and return true if found
function searchForMatch (array, matchee) {
  for (var i=0; i<array.length; i++) {
    if (array[i] === matchee) { return true; }
  }
  return false;
};

function keyUpHandler (e) {
  //TODO: hack to only prevent for movement keys, should be made more general
  if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode ===40) {
    e.preventDefault();
  }
  this.handleInputEvent('keyup', {keyCode: e.keyCode});
};

function keyDownHandler (e) {
  //TODO: hack to only prevent for movement keys, should be made more general
  if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode ===40) {
    e.preventDefault();
  }
  this.handleInputEvent('keydown', {keyCode: e.keyCode});
};
