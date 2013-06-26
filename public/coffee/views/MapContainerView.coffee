require 'views/CauseListView.js'
require 'views/MapView.js'

BFI.MapContainerView = Ember.ContainerView.extend
  mapView: BFI.MapView
  causeListView: BFI.CauseListView
  childViews: ['mapView', 'causeListView']

  didInsertElement: ->
    parent = @
    #configure eventManager in init to give it access to indexView
    @set "eventManager", Ember.Object.create
      parent: parent
      click: (event, view) ->
        content = view.get 'content'

        #we care about handling this if it's a cause
        if content instanceof BFI.Cause
          @get('parent').changeActiveCause(content)
  
  changeActiveCause: (cause) ->
    @get('controller.controllers.cause').set('content', cause)
