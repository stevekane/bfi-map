minispade.require('main.js');

var assert = chai.assert;

describe('Kane.InputEvent', function () {
  var ie;
  
  beforeEach(function () {
    ie = new Kane.InputEvent('testType', {});
  });

  it('should return an object', function () {
    assert.isObject(ie);
  });
});

