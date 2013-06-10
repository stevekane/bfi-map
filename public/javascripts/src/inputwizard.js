/*
this object is responsible for listening to keyboard events
and passing the information on to its subscribers after some
processing
*/

var InputWizardInterface = {
  addSubscriber: function (subscriber) {},  
  removeSubscriber: function (subscriber) {},  
  attachToDomNode: function (domNode) {},  
  removeFromDomNode: function (domNode) {},  
  activateKeyboardForDomNode: function (domNode) {},  
  deactivateKeyboardForDomNode: function (domNode) {},  

  //public interface attributes
  subscribers: [],
  domNodes: [],
};

Kane.InputWizard = function (settings) {
  _.extend(this, settings);

  this.subscribers = [];
  this.domNodes = [];

  /*
  we create instances of these functions that have a bound 
  "this" value in order to correctly apply/remove them from
  event-emitting domNodes
  */
  this.keyupHandler = keyupHandler.bind(this);
  this.keydownHandler = keydownHandler.bind(this);

};

Kane.InputWizard.prototype = Object.create(InputWizardInterface);

Kane.InputWizard.prototype.addSubscriber = function (subscriber) {
  if ("object" !== typeof subscriber) { 
    throw new Error('no subscriber provided'); 
  }

  this.subscribers.push(subscriber);
  
  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.removeSubscriber = function (subscriber) {
  if ("object" !== typeof subscriber) { 
    throw new Error('no subscriber provided'); 
  }

  if (!_.contains(this.subscribers, subscriber)) {
    throw new Error('subscriber provided is not a in the list of subscribers!');
  }

  this.subscribers = _.without(this.subscribers, subscriber);

  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.attachToDomNode = function (domNode) {
  if (_.contains(this.domNodes, domNode)) {
    throw new Error('provided domNode is already attached!');
  }

  //if no domNode provided, set domNode to document body
  domNode = (domNode) ? domNode : document.body;
  this.domNodes.push(domNode);
 
  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.removeFromDomNode = function (domNode) {
  //we throw so that we dont silently fail to remove 
  if (!domNode) { 
    throw new Error('no domnode provided'); 
  } 

  if (!_.contains(this.domNodes, domNode)) {
    throw new Error('domNode provided not in the list of domNodes');
  } 
  
  //force call to deactivate to prevent phantom event listeners
  this.deactivateKeyboardForDomNode(domNode);

  this.domNodes = _.without(this.domNodes, domNode);

  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.activateKeyboardForDomNode = function (domNode) {
  if (!domNode) { 
    throw new Error('no domNode provided'); 
  }

  if (!_.contains(this.domNodes, domNode)) {
    throw new Error('provided domNode is not in array of attached domNodes');
  }

  domNode.addEventListener('keyup', this.keyupHandler);
  domNode.addEventListener('keydown', this.keydownHandler);

  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.deactivateKeyboardForDomNode = function (domNode) {
  if (!domNode) { 
    throw new Error('no domNode provided'); 
  }

  if (!_.contains(this.domNodes, domNode)) {
    throw new Error('provided domNode is not in array of attached domNodes');
  }
  
  //here we are removing the 'bound' versions of these handlers
  domNode.removeEventListener('keyup', this.keyupHandler);
  domNode.removeEventListener('keydown', this.keydownHandler);

  //useful for chaining
  return this;
};


function keyupHandler (e) {
  var keyName = keyboardMapping[e.keyCode];

  //no keyName found for this key
  if (!keyName) { return; }

  _.each(this.subscribers, function (sub) {
    if (sub.keyup) {
      sub.keyup.call(sub, keyName);
    }
  });
};

function keydownHandler (e) {
  var keyName = keyboardMapping[e.keyCode];

  //no keyName found for this key
  if (!keyName) { return; }

  _.each(this.subscribers, function (sub) {
    if (sub.keydown) {
      sub.keydown.call(sub, keyName);
    }
  });
};

var keyboardMapping = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  45: "insert",
  46: "delete",
  8: "backspace",
  9: "tab",
  13: "enter",
  16: "shift",
  17: "ctrl",
  18: "alt",
  19: "pause",
  20: "capslock",
  27: "escape",
  32: "space",
  33: "pageup",
  34: "pagedown",
  35: "end",

  48: "0",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  
  65: "a",
  66: "b",
  67: "c",
  68: "d",
  69: "e",
  70: "f",
  71: "g",
  72: "h",
  73: "i",
  74: "j",
  75: "k",
  76: "l",
  77: "m",
  78: "n",
  79: "o",
  80: "p",
  81: "q",
  82: "r",
  83: "s",
  84: "t",
  85: "u",
  86: "v",
  87: "w",
  88: "x",
  89: "y",
  90: "z",

  112: "f1",
  113: "f2",
  114: "f3",
  115: "f4",
  116: "f5",
  117: "f6",
  118: "f7",
  119: "f8",
  120: "f9",
  121: "f10",
  122: "f11",
  123: "f12",

  144: "numlock",
  145: "scrolllock",
  186: "semicolon",
  187: "equal",
  188: "comma",
  189: "dash",
  190: "period",
  191: "slash",
  192: "graveaccent",
  219: "openbracket",
  220: "backslash",
  221: "closebracket",
  222: "singlequote"
};
