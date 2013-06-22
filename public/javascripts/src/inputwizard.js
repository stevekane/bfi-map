require('kane.js');

/*
this object is responsible for listening to keyboard events
and passing the information on to its subscribers after some
processing
*/

var InputWizardInterface = {
  stream: null
};

Kane.InputWizard = function (settings) {
  var domNode = settings.domNode ? settings.domNode : $('body')
    , streams = []
    , keyStreams = [];

  _.extend(this, settings);

  /*
  this is the broadcast channel for all events captured by this
  add keyboard event handlers and filter out the keyName
  TODO: add touch event handlers
  */

  function sameKey (prev, cur) {
    return (prev.keyName === cur.keyName && prev.type === cur.type); 
  };

  streams.push(
    domNode
      .asEventStream('mousemove')
      .map(mapMouse),
    domNode
      .asEventStream('mousedown')
      .map(mapMouse),
    domNode
      .asEventStream('mouseup')
      .map(mapMouse)
  );

  //group together the keyboard streams
  keyStreams.push(
    domNode
      .asEventStream('keyup')
      .filter(filterKey)
      .map(mapKey),
    domNode
      .asEventStream('keydown')
      .filter(filterKey)
      .map(mapKey)
  );

  //merge keyboard streams and skip the duplicates
  streams
    .push(Bacon.mergeAll(keyStreams).skipDuplicates(sameKey));

  /*
  merge all input streams from mouse/touch/keyboard 
  onto main stream we skip duplicates so that keys 
  already pressed don't jam up the stream
  */
  this.stream = Bacon.mergeAll(streams);
};
Kane.InputWizard.prototype = Object.create(InputWizardInterface);

function filterKey (e) {
  return keyboardMapping[e.keyCode];
};

function mapKey (e) {
  return {
    type: e.type,
    keyName: keyboardMapping[e.keyCode]
  };
};

function mapMouse (e) {
  var position = {
    x: e.offsetX,
    y: e.offsetY
  };
  return {
    type: e.type,
    position: position
  };
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
