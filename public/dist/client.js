minispade.register('application.js', function() {
"use strict";
window.BFI = Ember.Application.create();
minispade.require('controllers/CausesController.js');
minispade.require('controllers/CauseController.js');
minispade.require('views/CausesView.js');
minispade.require('views/CauseItemView.js');
minispade.require('views/CauseListView.js');
minispade.require('views/CausesGridView.js');
minispade.require('views/CausesMapView.js');
minispade.require('views/GridTileView.js');
minispade.require('views/GridView.js');
minispade.require('views/MapContainerView.js');
minispade.require('views/MapView.js');
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
  needs: ['cause'],
  createCauses: function(data) {
    var cause, _i, _len, _ref, _results;
    _ref = data.causes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cause = _ref[_i];
      _results.push(this.pushObject(BFI.Cause.create(cause)));
    }
    return _results;
  }
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
  goal: null,
  progress: null,
  followers: null,
  daysToGo: null,
  description: "",
  backgroundImage: "background-image: url(http://christiannewsng.com/wp-content/uploads/2013/03/Charity.jpg);\nbackground-size: contain;",
  percentOfGoal: (function() {
    var goal, progress;
    goal = this.get('goal');
    progress = this.get('progress');
    return Math.round(progress / goal * 100);
  }).property('goal', 'progress'),
  progressStyle: (function() {
    return "width: " + (this.get("percentOfGoal")) + "%";
  }).property('percentOfGoal')
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
BFI.Router.map(function() {
  return this.resource("causes", function() {
    this.route("map");
    return this.route("grid");
  });
});

BFI.IndexRoute = Ember.Route.extend({
  redirect: function() {
    return this.replaceWith("causes");
  }
});

BFI.CausesRoute = Ember.Route.extend({
  events: {
    showmap: function() {
      return this.transitionTo("causes.map");
    },
    showgrid: function() {
      return this.transitionTo("causes.grid");
    }
  },
  setupController: function(controller) {
    return BFI.Cause.fetch(controller);
  }
});

BFI.CausesGridRoute = Ember.Route.extend({
  renderTemplate: function() {
    var controller;
    controller = this.controllerFor('causes');
    return this.render("causes/grid", {
      into: 'causes',
      controller: controller
    });
  }
});

BFI.CausesMapRoute = Ember.Route.extend({
  renderTemplate: function() {
    var controller;
    controller = this.controllerFor('causes');
    return this.render("causes/map", {
      into: 'causes',
      controller: controller
    });
  }
});

});

minispade.register('views/CauseItemView.js', function() {
"use strict";
BFI.CauseItemView = Ember.View.extend({
  templateName: "causeitem"
});

});

minispade.register('views/CauseListView.js', function() {
"use strict";
BFI.CauseListView = Ember.View.extend({
  templateName: 'causelist'
});

});

minispade.register('views/CausesGridView.js', function() {
"use strict";

minispade.require('views/CauseItemView.js');

BFI.CausesGridView = Ember.View.extend({
  templateName: 'causes/grid'
});

});

minispade.register('views/CausesMapView.js', function() {
"use strict";
BFI.CausesMapView = Ember.View.extend({
  templateName: 'causes/map'
});

});

minispade.register('views/CausesView.js', function() {
"use strict";
BFI.CausesView = Ember.View.extend({
  templateName: 'causes'
});

});

minispade.register('views/GridTileView.js', function() {
"use strict";
BFI.GridTileView = Ember.View.extend({
  tagName: 'li',
  templateName: 'gridtile'
});

});

minispade.register('views/GridView.js', function() {
"use strict";

minispade.require('views/GridTileView.js');

BFI.GridView = Ember.CollectionView.extend({
  itemViewClass: BFI.GridTileView,
  contentBinding: "controller.content"
});

});

minispade.register('views/MapContainerView.js', function() {
"use strict";

minispade.require('views/CauseListView.js');
minispade.require('views/MapView.js');

BFI.MapContainerView = Ember.ContainerView.extend({
  mapView: BFI.MapView,
  causeListView: BFI.CauseListView,
  childViews: ['mapView', 'causeListView'],
  didInsertElement: function() {
    var parent;
    parent = this;
    return this.set("eventManager", Ember.Object.create({
      parent: parent,
      click: function(event, view) {
        var content;
        content = view.get('content');
        if (content instanceof BFI.Cause) {
          return this.get('parent').changeActiveCause(content);
        }
      }
    }));
  },
  changeActiveCause: function(cause) {
    return this.get('controller.controllers.cause').set('content', cause);
  }
});

});

minispade.register('views/MapView.js', function() {
"use strict";
BFI.MapView = Ember.View.extend({
  templateName: "map",
  markers: [],
  didInsertElement: function() {
    var mapDiv, self;
    mapDiv = $("<div></div>");
    mapDiv.attr({
      id: "map"
    });
    mapDiv.appendTo(this.$());
    self = this;
    self.createMap();
    self.addObserver("controller.content.@each", self, self.placeMarkers);
    return self.addObserver("controller.controllers.cause.content", self, self.highlightActive);
  },
  willDestroyElement: function() {
    var self;
    self = this;
    self.removeObserver("controller.content.@each", self, self.placeMarkers);
    self.removeObserver("controller.controllers.cause.content", self, self.highlightActive);
    return this.get('map').remove();
  },
  createMap: function() {
    var mapData, zoomControls;
    zoomControls = this.createZoomControl('topright');
    mapData = this.createMapData();
    return this.set('map', new L.map('map').setView([41.87, -87.65], 13).addLayer(mapData).addControl(zoomControls));
  },
  placeMarkers: (function() {
    var cause, causes, map, marker, markers, _i, _j, _len, _len1, _results;
    map = this.get('map');
    markers = this.get('markers');
    causes = this.get('controller.content');
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
  }),
  highlightActive: function() {
    var activeCause;
    activeCause = this.get('controller.controllers.cause.content');
    if (activeCause) {
      return this.get('map').setView([activeCause.lat, activeCause.long], 13);
    }
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
  },
  createMarker: function(lat, long, name) {
    console.log('createMarker fired');
    return new L.Marker([lat, long], {
      title: name,
      zIndexOffset: 5,
      riseOnHover: true
    });
  }
});

});
