minispade.require('main.js');

var assert = chai.assert;

describe('Kane.InputQueue', function () {
  var ib
    , inputEv;

  beforeEach(function () {
    ib = Test.createInputQueue();  
    inputEv = Test.createInputEvent();
  });

  it('should return an object', function () {
    assert.isObject(ib); 
  });
  
  it('should define an array called eventQueue', function () {
    assert.isArray(ib.eventQueue);
  });

  describe('#enqueueEvent()', function () {
    it('should be a function', function () {
      assert.isFunction(ib.enqueueEvent);
    });
    it('should add an event to the event queue', function () {
      ib.enqueueEvent(inputEv);
      
      assert.isObject(ib.eventQueue[0]);
    });
  });

  describe('#fetchNextEvent()', function () {
    it('should be a function', function () {
      assert.isFunction(ib.fetchNextEvent);
    });

    it('should return the event at the head of the queue', function () {
      var firstEv
        , fetchedEv;

      ib.enqueueEvent(inputEv);
      //save ref to first object in queue
      firstEv = ib.eventQueue[0];
      fetchedEv = ib.fetchNextEvent(); 
      
      assert.equal(firstEv, fetchedEv);
    });

    it('should return null if no events', function () {
      assert.equal(ib.eventQueue.length, 0);
      assert.isNull(ib.fetchNextEvent());
    });
  });

  describe('#fetchAllEvents()', function () {
    it('should be a function', function () {
      assert.isFunction(ib.fetchAllEvents);
    });

    it('should return an array of all events', function () {
      var eventsArray = [];

      ib.enqueueEvent(inputEv); 
      eventsArray = ib.fetchAllEvents();      

      assert.isArray(eventsArray);
      assert.equal(eventsArray.length, 1);
      assert.equal(inputEv, eventsArray[0]);
    });

    it('should return an empty array if eventQueue is empty', function () {
      var eventsArray = ib.fetchAllEvents();

      assert.isArray(eventsArray);
      assert.equal(eventsArray.length, 0);
    });

    it('should reset the eventQueue object to an empty array', function () {
      //add an element to the queue
      ib.enqueueEvent(inputEv);
      ib.fetchAllEvents();
      
      assert.equal(ib.eventQueue.length, 0);
    });
  });

  describe('#resetQueue()', function () {
    it('should be a function', function () {
      assert.isFunction(ib.resetQueue);
    });

    it('should reset the queue to an empty array', function () {
      ib.enqueueEvent(inputEv);
      ib.resetQueue();
      
      assert.equal(ib.eventQueue, 0); 
    });
  });

});
