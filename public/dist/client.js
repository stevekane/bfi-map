minispade.register('application.js', function() {
"use strict";
window.BFI = Ember.Application.create();
minispade.require('controllers/CausesController.js');
minispade.require('controllers/CauseController.js');
minispade.require('controllers/IndexController.js');
minispade.require('views/IndexView.js');
minispade.require('router/router.js');
minispade.require('models/Cause.js');

});

minispade.register('controllers/CauseController.js', function() {
"use strict";
BFI.CauseController = Ember.ObjectController.extend();

});

minispade.register('controllers/CausesController.js', function() {
"use strict";
BFI.CausesController = Ember.ArrayController.extend({
  createCauses: function(data) {
    var cause, _i, _len, _ref, _results;
    _ref = data.causes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cause = _ref[_i];
      cause.progress = Math.round(Math.random() * 100);
      _results.push(this.pushObject(BFI.Cause.create(cause)));
    }
    return _results;
  }
});

});

minispade.register('controllers/IndexController.js', function() {
"use strict";
BFI.IndexController = Ember.Controller.extend({
  needs: ['causes', 'cause']
});

});

minispade.register('map.js', function() {
"use strict";


});

minispade.register('models/Cause.js', function() {
"use strict";
BFI.Cause = Ember.Object.extend({
  name: "",
  lat: null,
  long: null,
  progressStyle: (function() {
    return "width: " + (this.get('progress'));
  }).property('progress')
});

BFI.Cause.reopenClass({
  fetch: function(controller) {
    return $.getJSON('public/json/causes.json').done(function(data) {
      return controller.createCauses(data);
    }).fail(function() {
      return console.log('attempt to load failed');
    }).always(function() {
      return console.log('always fired');
    });
  }
});

});

minispade.register('router/router.js', function() {
"use strict";
BFI.IndexRoute = Ember.Route.extend({
  setupController: function(controller) {
    var causeCon, causesCon;
    causesCon = controller.get('controllers.causes');
    causeCon = controller.get('controllers.cause');
    console.log('setupController fired');
    return BFI.Cause.fetch(causesCon);
  }
});

});

minispade.register('views/IndexView.js', function() {
"use strict";
BFI.IndexView = Ember.View.extend({
  didInsertElement: function() {
    return this.createMap();
  },
  createMap: function() {
    var mapData, zoomControls;
    zoomControls = this.createZoomControl('topright');
    mapData = this.createMapData();
    this.map = new L.map('map').setView([41.8, -87.65], 13).addLayer(mapData).addControl(zoomControls);
  },
  createZoomControl: function(position) {
    return new L.Control.Zoom({
      position: position
    });
  },
  createMapData: function() {
    return new L.tileLayer('http://{s}.tile.cloudmade.com/\ne6b28fa129d84b298c65c9fc758be34b/\n997/\n256/\n{z}/{x}/{y}.png', {
      attribution: 'cloudmade',
      zoomControl: false
    });
  }
});

});
