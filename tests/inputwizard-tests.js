minispade.require('main.js');

var assert = chai.assert;

describe('Kane.InputWizard', function () {
  var iw;
  
  beforeEach(function () {
    iw = new Kane.InputWizard();
  });

  it('should return an object', function () {
    assert.isObject(iw); 
  });
  
  describe('#addSubscriber()', function () {
    it('should be a function', function () {
      assert.isFunction(iw.addSubscriber);
    });
  
    it('should throw if no subscriber object provided', function () {
      assert.throws(function () {
        iw.addSubscriber();
      }); 
    });

    it('should add the object to subscribers list', function () {
      var sub = {name: 'testsub'}
        , addedSub;

      iw.addSubscriber(sub);
      
      //pick off the first subscriber
      addedSub = iw.subscribers[0]; 
      
      assert.equal(addedSub, sub);
    });
  });

  describe('#removeSubscriber()', function () {
    it('should be a function', function () {
      assert.isFunction(iw.removeSubscriber);
    });

    it('should throw if no subscriber object provided', function () {
      assert.throws(function () {
        iw.removeSubscriber();
      }); 
    });

    it('should remove the subscriber from the list of subscribers', function () {
      var sub = {name: 'another'};

      iw.addSubscriber(sub)
        .removeSubscriber(sub);
      
      assert.lengthOf(iw.subscribers, 0);
    });

    //we want this to throw so we dont fail silently and then not remove our subscriber
    it('should throw if the subscriber is not in the list of subscribers', function () {
      assert.throws(function () {
        iw.removeSubscriber({});
      });
    });
  });
 
  describe('#attachToDomNode()', function () {
    var domNode;

    before(function () {
      var div = document.createElement('div');
      div.id = 'testdiv';
      document.body.appendChild(div);
      domNode = document.getElementById('testdiv');
    });

    it('should be a function', function () {
      assert.isFunction(iw.attachToDomNode);
    });

    it('should add the domNode to the current domNodes', function () {
      iw.attachToDomNode(domNode);
      assert.equal(iw.domNodes[0], domNode);
    });
    
    it('should assign the domnode to document.body if none is provided', function () {
      iw.attachToDomNode();
      assert.equal(iw.domNodes[0], document.body);
    });
  });

  describe('#removeFromDomNode()', function () {
    var domNode;

    before(function () {
      var div = document.createElement('div');
      div.id = 'testdiv';
      document.body.appendChild(div);
      domNode = document.getElementById('testdiv');
    });

    it('should be a function', function () {
      assert.isFunction(iw.removeFromDomNode);
    });
  
    it('should throw if no domnode is provided or provided domnode isnt in domnodes', function () {
      assert.throws(function () {
        iw.removeFromDomNode();
      });
      assert.throws(function () {
        iw.removeFromDomNode(document.body);
      });
    });

    it('should remove the domNode from domNodes', function () {
      iw.attachToDomNode(domNode)
        .removeFromDomNode(domNode);

      assert.lengthOf(iw.domNodes, 0);
    });
  });
  
});
