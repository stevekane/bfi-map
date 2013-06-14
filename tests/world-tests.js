minispade.require('main.js');

var assert = chai.assert;

describe('Kane.World', function () {
  var w
    , data = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
    , bus = {}
    , drawplane = {};

  beforeEach(function () {
    w = new Kane.World({
      bus: bus,
      drawplane: drawplane,
    });
  });

  it('should return an object', function () {
    assert.isObject(w);
  });

  it('should throw if no bus is provided', function () {
    assert.throws(function () {
      w = new Kane.World();
    });
  });

  describe("#loadData()", function () {
    it('should load the current Data into the world object', function () {
      w.loadData(data); 

      assert.isTrue(w.isLoaded);
    });
     
    it('should throw if no data object is provided', function () {
      assert.throws(function () {
        w.loadData();
      });
    });
  });

  //not testing this further as it's a fucking pain in the ass
  describe("#loadRemoteData()", function () {
    it('should send an ajax request for a json file by the specified name' +
       'and it should fire the provided success/error callbacks', function (done) {
      
      function success () {
        console.log('success');
        done();
      };
      function error () {
        console.log('error!');
        done();
      };

      w.loadRemoteData('public/json/spritesheet.json', w, success, error); 
    });
    
    it('should throw if not provided jsonName', function () {
      assert.throws(function () {
        w.loadRemoteData();
      });
    });
  });
});
