minispade.require('assetloader.js');

var assert = chai.assert;
  var al;
  
  beforeEach(function () {
    al = new Kane.AssetLoader();
  });

describe("Kane.AssetLoader", function () {
  it('should return a new object', function () {
    assert.isObject(al);
  });
});
