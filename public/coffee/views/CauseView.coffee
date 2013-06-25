BFI.CauseView = Ember.View.extend
  click: ->
    cause = @get 'content'
    parentView = @get 'parentView'
    element = @$().children '.bullet-item'

    #modify appearance for 2 seconds
    element.css({
      backgroundColor: 'black'
      color: 'white'
    })

    Ember.run.later(() ->
      element.css({
        backgroundColor: '#DDDDDD'
        color: 'black'
      })
    , 2000)
    
    #grab the map object 
    parentView.get('map').setView([cause.lat, cause.long], 15)
