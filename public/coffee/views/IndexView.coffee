BFI.IndexView = Ember.View.extend

  #this is an array of all current markers
  markers: []

  didInsertElement: ->
    @createMap()

  willDestroyElement: () ->
    #should add teardown procedure here

  createMap: ->
    #reference to all our loaded causes
    causes = @get 'controller.controllers.causes.content'

    zoomControls = @createZoomControl 'topright'
    mapData = @createMapData()

    #finds the div w/ id "map" in the DOM and adds layers/controls
    #also defines our initial lat/long settings
    @set('map', new L.map('map')
      .setView([41.87, -87.65], 13)
      .addLayer(mapData)
      .addControl(zoomControls)
    )

  #observer that re-creates markers whenever causes change
  markerObserver: (->
    map = @get 'map'
    markers = @get 'markers'
    causes = @get 'controller.controllers.causes.content'

    #wipe out old markers
    for marker in markers
      map.removeLayer marker

    #flush the markers
    markers = []

    #create new markers
    for cause in causes
      marker = @createMarker(cause.lat, cause.long, cause.name)
      map.addLayer marker

  ).observes('controller.controllers.causes.content.@each')

  createZoomControl: (position) ->
    new L.Control.Zoom({position: position})

  createMapData: () ->
    new L.tileLayer(
      '''http://{s}.tile.cloudmade.com/
         e6b28fa129d84b298c65c9fc758be34b/
         997/
         256/
         {z}/{x}/{y}.png'''
      , {
          attribution: 'cloudmade'
          zoomControl: false
      }
    )
  
  createMarker: (lat, long, name) ->
    new L.Marker(
      [lat, long],
      {
        title: name
        zIndexOffset: 5
        riseOnHover: true
      }
    )

