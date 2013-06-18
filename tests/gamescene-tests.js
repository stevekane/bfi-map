minispade.require('gamescene.js');

var assert = chai.assert;

describe("Kane.GameScene", function () {
  var gs
    , entMan = {
        removeDead: function () {},
        sortBy: function () {},
        updateAll: function () {},
        drawAll: function () {},
    }
    , camera = {
        draw: function () {} 
    };

  beforeEach(function () {
    gs = new Kane.GameScene({
      name: 'game',
      entityManager: entMan,
      camera: camera
    });
  });

  it('should return an object', function () {
    assert.isObject(gs);
  });

  it('should throw if not provided a camera', function () {
    assert.throws(function () {
      gs = new Kane.GameScene({
        name: 'game',
        entityManager: entMan,
      });
    });
  });

  it('should throw if not provided an entityManager', function () {
    assert.throws(function () {
      gs = new Kane.GameScene({
        name: 'game',
        camera: camera
      });
    });
  });

  describe("#draw()", function () {
    it('it is a function', function () {
      assert.isFunction(gs.draw); 
    });
  });
});
