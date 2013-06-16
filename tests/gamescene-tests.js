minispade.require('gamescene.js');

var assert = chai.assert;

describe("Kane.GameScene", function () {
  var gs
    , entMan = {
        removeDead: function () {},
        sortBy: function () {},
        updateAll: function () {},
        drawAll: function () {},
    };

  beforeEach(function () {
    gs = new Kane.GameScene({
      name: 'game',
      bus: new Bacon.Bus(),
      entityManager: entMan,
      inputWizard: {} 
    });
  });

  it('should return an object', function () {
    assert.isObject(gs);
  });
});
