minispade.require('inputwizard.js');

var assert = chai.assert;

describe('Kane.InputWizard', function () {
  var iw;
  
  beforeEach(function () {
    iw = new Kane.InputWizard({});
  });

  it('should return an object that exposes a stream', function () {
    assert.isObject(iw); 
    assert.isDefined(iw.stream);
  });

  
  it('should emit an event on stream when keyup fired on domnode', 
  function (done) {
    var keyupEvent
      , keyCode = 40
      , keyName = 'down';

    iw.stream.filter(function (e) {
      return e.type === 'keyup';
    }).onValue(function (e) {
      assert.equal(e.type, 'keyup');
      assert.equal(e.keyName, keyName);
      done();
    });
  
    keyupEvent = jQuery.Event('keyup');
    keyupEvent.keyCode = keyCode; 
    $('body').trigger(keyupEvent); 
  });

  it('should emit an event on stream when keydown fired on domnode', 
  function (done) {
    var keydownEvent
      , keyCode = 16  
      , keyName = 'shift';

    iw.stream.filter(function (e) {
      return e.type === 'keydown';
    }).onValue(function (e) {
      assert.equal(e.type, 'keydown');
      assert.equal(e.keyName, keyName);
      done();
    });
  
    keydownEvent = jQuery.Event('keydown');
    keydownEvent.keyCode = keyCode; 
    $('body').trigger(keydownEvent); 
  });
  
  //TODO: create jQuery.Event w/ offsetX/Y values to test those in event stream
  it('should emit an event on stream when mouseup fired on domnode', 
  function (done) {
    iw.stream
    .filter(function (e) {
      return e.type === "mouseup";
    }).onValue(function (e) {
      assert.equal(e.type, 'mouseup');
      done();
    });
    $('body').trigger('mouseup');
  });

  it('should emit an event on stream when mousedown fired on domnode', 
  function (done) {
    iw.stream
    .filter(function (e) {
      return e.type === "mousedown";
    }).onValue(function (e) {
      assert.equal(e.type, 'mousedown');
      done();
    });
    $('body').trigger('mousedown');
  });

  it('should emit an event on stream when mousemove fired on domnode', 
  function (done) {
    iw.stream
    .filter(function (e) {
      return e.type === "mousemove";
    }).onValue(function (e) {
      assert.equal(e.type, 'mousemove');
      done();
    });
    $('body').trigger('mousemove');
  });
});
