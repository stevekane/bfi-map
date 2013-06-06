var InputQueueInterface = {
  enqueueEvent: function (ev) {},
  fetchNextEvent: function () {},
  fetchAllEvents: function () {},
  resetQueue: function () {},
};

Kane.InputQueue = function () {
  this.eventQueue = [];
};

Kane.InputQueue.prototype = Object.create(InputQueueInterface);

//pushes events onto tail of the queue
Kane.InputQueue.prototype.enqueueEvent = function (ev) {
  this.eventQueue.push(ev);
};

//shifts events from head of the queue
Kane.InputQueue.prototype.fetchNextEvent = function () {
  if (0 === this.eventQueue.length) { return null; }
  return this.eventQueue.shift(); 
};

//returns the eventQueue array and resets it
Kane.InputQueue.prototype.fetchAllEvents = function () {
  var events = [];

  events = this.eventQueue;
  this.resetQueue();
  return events; 
};

//This does NOT return the queue, just resets it
Kane.InputQueue.prototype.resetQueue = function () {
  this.eventQueue = [];
};
