BFI.MapView = Ember.View.extend
  templateName: "map"

  #this is an array of all current markers
  markers: []

  didInsertElement: ->
    mapDiv = $("<div></div>")
    mapDiv.attr({id: "map"})
    mapDiv.appendTo @$()

    self = @
    self.createMap()

    @placeMarkers()

    #add observation of causes to re-draw markers
    self.addObserver(
      "controller.content.@each",
      self,
      self.placeMarkers
    )

    #add observer to position map around active cause
    self.addObserver(
      "controller.controllers.cause.content",
      self,
      self.highlightActive
    )

  willDestroyElement: () ->
    #remove marker placement observer
    self = @
    self.removeObserver(
      "controller.content.@each",
      self,
      self.placeMarkers
    )
    self.removeObserver(
      "controller.controllers.cause.content",
      self,
      self.highlightActive
    )

    @get('map').remove()

  createMap: ->
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
  placeMarkers: ->
    map = @get 'map'
    markers = @get 'markers'
    causes = @get 'controller.content'

    #wipe out old markers
    for marker in markers
      map.removeLayer marker

    ##flush the markers
    markers = []

    #create new markers
    for cause in causes
      marker = @createMarker(cause.lat, cause.long, cause.name)
      map.addLayer marker

  highlightActive: () ->
    activeCause = @get 'controller.controllers.cause.content'
    if activeCause
      @get('map').setView([activeCause.lat, activeCause.long], 13)

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
