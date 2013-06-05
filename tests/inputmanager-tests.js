minispade.require('main.js');

var assert = chai.assert;

describe('Kane.InputManager', function () {
  var im
    , iq;

  beforeEach(function () {
    iq = Test.createInputQueue();
    im = new Kane.InputManager(iq);
  });

  it('should produce an object', function () {
    assert.isObject(im); 
  });

  it('should throw if no InputQueue object provided to constructor', function () {
    assert.throws(function () {
      new Kane.InputManager();
    });
  });
  
  it('should accept an optional domnode to attach events to', function () {
    //create a temp domnode
    var id = 'testdiv' 
      , div = document.createElement('div')
      , domNode;

    div.id = id;
    document.body.appendChild(div);
    domNode = document.getElementById(id);
    
    var im = new Kane.InputManager(iq, domNode)
    
    assert.equal(im.domNode, domNode);
    
    //remove the temp domnode
    document.getElementById(id).remove();
  });

  it('should assign domNode to document.body if no domnode provided to constructor', function () {
    assert.equal(im.domNode, document.body);
  });

  it('should assign provided inputQueue to attr inputQueue', function () {
    assert.isDefined(im.inputQueue);
    assert.equal(iq, im.inputQueue);
    assert.isObject(im.inputQueue);
  });

  describe('#handleInputEvent()', function () {
    it('should be a function', function () {
      assert.isFunction(im.handleInputEvent);
    });
    
    it('throw if not provided two params, type and data', function () {
      assert.throws(function () {
        im.handleInputEvent();
      });
      assert.doesNotThrow(function () {
        im.handleInputEvent('type', {});
      });
    });
  });

});
