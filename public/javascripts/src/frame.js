var FrameInterface = {};

Kane.Frame = function (settings) {
  var error;

  if (undefined === settings.x) { error = "no x provided"; }
  if (undefined === settings.y) { error = "no y provided"; }
  if (undefined === settings.w) { error = "no w provided"; }
  if (undefined === settings.h) { error = "no h provided"; }
  if (error) { throw new Error(error); }

  _.extend(this, settings);
};

Kane.Frame.prototype = Object.create(FrameInterface);

