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

  describe("#draw()", function () {
    it('should throw if no camera is defined', function () {
      var camera = {
        draw: function () {}
      };
      assert.throws(function () {
        gs.draw();
      });

      gs.camera = camera;

      assert.doesNotThrow(function () {
        gs.draw();
      });
    });
  });
});
