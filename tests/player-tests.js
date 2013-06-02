minispade.require('main.js');

var assert = chai.assert;

describe("Kane.Player", function () {

  it('should return an object', function () {
    assert.isObject(new Kane.Player()); 
  });

  describe("#move()", function () {
    var mover;

    beforeEach(function () {
      mover = new Kane.Player();
    });

    it('should be a function', function () {
      assert.isFunction(mover.move, 'move is a function');
    });

    it('should throw if not provided an number deltaTime', function () {
      assert.throws(function () {
        mover.move('someString');
      });
      assert.doesNotThrow(function () {
        mover.move(1000);
      });
    });

    it('should throw if not provided any deltaTime', function () {
      assert.throws(function () {
        mover.move();
      });
    });

    it('should increase position according to laws of motion', function () {
      var timeDelta = .5 
        , yVelocity = 10 
        , height = mover.height 
        , grav = mover.grav
        , newPosition = .5 * grav * timeDelta * timeDelta
                        + yVelocity * timeDelta
                        + height;

      mover.yVelocity = yVelocity;
      mover.move(timeDelta);
      
      assert.equal(
        newPosition,
        mover.y,
        'position matches expected change'
      );
      
    });
    
    it('should set player.y to player.height if below player.height', function () {
      var timeDelta = 3 
        , yVelocity = 1 

      mover.yVelocity = yVelocity;
      mover.move(timeDelta);
      
      assert.equal(
        mover.height,
        mover.y,
        'position is 0 since on ground'
      );
      
    });

  });
  describe("#jump()", function () {
    var jumper;

    beforeEach(function () {
      jumper = new Kane.Player();
    });
    
    it('should be a function', function () {
      assert.isFunction(jumper.jump, 'jump is a function'); 
    });
    
    //vv = vertical velocity
    it('should increase players vv by jumpVelocity', function () {
      jumper.jump();
      assert.equal(
        jumper.getYVelocity(),
        jumper.getJumpVelocity(),
        'players vv is equal to jump velocity'
      );
    });

    it('should not change players vv if already jumping', function () {
      var velInitial, velSecondary;

      jumper.jump();
      velInitial = jumper.getYVelocity();      
      jumper.jump();
      velSecondary = jumper.getYVelocity();
      assert.equal(
        velInitial,
        velSecondary,
        "vv does not change if player is already jumping"
      );
    });
  });
  
  describe("#duck()", function () {
    var ducker;
 
    beforeEach(function () {
      ducker = new Kane.Player();        
    });
  
    it('should be a function', function () {
      assert.isFunction(ducker.duck, 'duck is a function'); 
    });

    it('should do nothing if player isDucking', function () {
      ducker.duck();
      assert.isTrue(
        ducker.isDucking, 
        'ducking is true after ducking'
      ); 
    }); 

    it('should do nothing if player isJumping', function () {
      ducker.jump();
      ducker.duck();
      assert.isFalse(
        ducker.isDucking, 
        'ducking is false if jumping is true'
      ); 
    }); 
  
    it('should remove isDucking after duckDuration', function (done) {
      ducker.duck();
      window.setTimeout(function () {
        assert.isFalse(
          ducker.isDucking,
          'isDucking false after duck duration'
        );
        done();
      }.bind(this), ducker.duckDuration); 
    });

  });

});
