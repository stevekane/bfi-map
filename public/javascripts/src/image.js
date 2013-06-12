var ImageInterface = {
  addFile: function (fileName) {},
  removeFile: function (fileName) {},

  //public interface attributes
  files: [],
};

Kane.Image = function (settings) {
  this.files = [];

  _.extend(this, settings);
};

Kane.Image.prototype = Object.create(ImageInterface);

Kane.Image.prototype.addFile = function (fileName) {
  //do nothing if this fileName already exists
  if (_(this.files).contains(fileName)) {
    return;
  }
  this.files.push(fileName);
};

Kane.Image.prototype.removeFile = function (fileName) {
  //do nothing if this fileName already exists
  if (!_(this.files).contains(fileName)) {
    throw new Error('fileName not found in files');
  }

  //TODO: simplest way...not entirely efficient
  this.files = _(this.files).without(fileName);
};
