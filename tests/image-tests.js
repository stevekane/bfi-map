minispade.require('main.js');

var assert = chai.assert;

describe('Kane.Image', function () {
  var image;

  beforeEach(function () {
    image = new Kane.Image();
  });

  it('should return an object', function () {
    assert.isObject(image);
  });

  it('should define an array of images', function () {
    assert.isArray(image.files);
  });

  describe('#addFile()', function () {
    it('should be a function', function () {
      assert.isFunction(image.addFile);
    });
  
    it('should add an additional file to the list of files', function () {
      var fileName = 'cat.png';

      image.addFile(fileName);
      assert.lengthOf(image.files, 1);
      assert.equal(image.files[0], fileName);
    });

    it('should not add filenames that are already in files array', function () {
      var fileName = "cat.png";
  
      image.addFile(fileName);
      image.addFile(fileName);
      image.addFile(fileName);
      image.addFile(fileName);
      
      //here we assert that only 1 copy of the fileName was added
      assert.lengthOf(image.files, 1);
    });
  });
  
  describe('#removeFile()', function () {
    it('should be a function', function () {
      assert.isFunction(image.removeFile);
    }); 

    it('should remove the fileName from the list of files', function () {
      var fileName = 'cat.png';

      image.addFile(fileName);
      image.removeFile(fileName);
      
      assert.lengthOf(image.files, 0);
    });
  });
  
});
