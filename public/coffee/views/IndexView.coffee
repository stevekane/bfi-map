BFI.IndexView = Ember.View.extend

  didInsertElement: ->
    @createMap()

  createMap: () ->
    zoomControls = @createZoomControl('topright')
    mapData = @createMapData()

    #finds the div w/ id "map" in the DOM
    @map = new L.map('map')
      .setView([41.8, -87.65], 13)
      .addLayer(mapData)
      .addControl(zoomControls)

    return

  createZoomControl: (position) ->
    return new L.Control.Zoom({position: position})

  createMapData: () ->
    return new L.tileLayer(
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
