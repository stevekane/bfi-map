minispade.require('main.js');

var assert = chai.assert;

describe('Kane.World', function () {
  var w;

  beforeEach(function () {
    w = new Kane.World();
  });

  it('should return an object', function () {
    assert.isObject(w);
  });

  it('should assign properties based on the provided input hash', function () {
    w = new Kane.World({
      beep: 'beep'
    });

    assert.equal('beep', w.beep);
  });
});
