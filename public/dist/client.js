minispade.register('application.js', function() {
"use strict";
window.BFI = Ember.Application.create();
minispade.require('controllers/IndexController.js');
minispade.require('views/IndexView.js');
minispade.require('controllers/CausesController.js');
minispade.require('controllers/CauseController.js');
minispade.require('views/CauseView.js');
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

minispade.register('views/CauseView.js', function() {
"use strict";
BFI.CauseView = Ember.View.extend({
  click: function() {
    var cause, element, parentView;
    cause = this.get('content');
    parentView = this.get('parentView');
    element = this.$().children('.bullet-item');
    element.css({
      backgroundColor: 'black',
      color: 'white'
    });
    Ember.run.later(function() {
      return element.css({
        backgroundColor: '#DDDDDD',
        color: 'black'
      });
    }, 2000);
    return parentView.get('map').setView([cause.lat, cause.long], 15);
  }
});

});

minispade.register('views/IndexView.js', function() {
"use strict";
BFI.IndexView = Ember.View.extend({
  markers: [],
  didInsertElement: function() {
    return this.createMap();
  },
  willDestroyElement: function() {},
  createMap: function() {
    var causes, mapData, zoomControls;
    causes = this.get('controller.controllers.causes.content');
    zoomControls = this.createZoomControl('topright');
    mapData = this.createMapData();
    return this.set('map', new L.map('map').setView([41.87, -87.65], 13).addLayer(mapData).addControl(zoomControls));
  },
  markerObserver: (function() {
    var cause, causes, map, marker, markers, _i, _j, _len, _len1, _results;
    map = this.get('map');
    markers = this.get('markers');
    causes = this.get('controller.controllers.causes.content');
    for (_i = 0, _len = markers.length; _i < _len; _i++) {
      marker = markers[_i];
      map.removeLayer(marker);
    }
    markers = [];
    _results = [];
    for (_j = 0, _len1 = causes.length; _j < _len1; _j++) {
      cause = causes[_j];
      marker = this.createMarker(cause.lat, cause.long, cause.name);
      _results.push(map.addLayer(marker));
    }
    return _results;
  }).observes('controller.controllers.causes.content.@each'),
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
  },
  createMarker: function(lat, long, name) {
    return new L.Marker([lat, long], {
      title: name,
      zIndexOffset: 5,
      riseOnHover: true
    });
  }
});

});
